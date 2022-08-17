import { config } from "../config";
import prisma from "../data/prisma";
import { endpointAuth } from "../auth/endpointAuth";
import { withValidation } from "../utils/withValidation";
import { Router } from "express";
import { z } from "zod";
import { createAccessToken } from "../auth/jwt/jwt";
import { createAccessTokenCookie, createEmptyAccessTokenCookie } from "../auth/cookie";
import { removeJti } from "../auth/jwt/jwtWhitelist";

export const authRouter = Router();

authRouter.get(
  "/discord-callback",
  withValidation(
    {
      query: z
        .object({
          code: z.string(),
        })
        .strict(),
    },
    async (req, res) => {
      const { code } = req.query;

      const params = new URLSearchParams({
        client_id: config.DISCORD_CLIENT_ID,
        client_secret: config.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: config.DISCORD_REDIRECT_URL,
      });

      try {
        const tokenResponse = await fetch(`${config.DISCORD_API_BASEURL}/oauth2/token`, {
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (!tokenResponse.ok)
          return res.status(tokenResponse.status ?? 500).json({
            statusCode: tokenResponse.status ?? 500,
            error: `Failed to get token response Discord: ${tokenResponse.statusText}`,
            message: `Failed to get token response Discord: ${tokenResponse.statusText}`,
          });

        const { access_token } = await tokenResponse.json();
        if (!access_token)
          return res.status(500).json({ error: "No access token in Discord's response" });

        const userResponse = await fetch(`${config.DISCORD_API_BASEURL}/oauth2/@me`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!userResponse?.ok)
          return res.status(userResponse?.status ?? 500).json({
            statusCode: userResponse?.status ?? 500,
            error: `Failed to get user response Discord: ${userResponse?.statusText}`,
            message: `Failed to get user response Discord: ${userResponse?.statusText}`,
          });

        const userId = (await userResponse.json())?.user?.id;
        if (!userId)
          return res.status(400).json({
            statusCode: 400,
            error: "Bad request",
            message: "Invalid token",
          });

        if (!config.ALLOWED_USER_IDS.includes(userId))
          return res.status(403).json({
            statusCode: 403,
            error: "Forbidden",
            message: "You're not allowed to login",
          });

        const user = await prisma.user.upsert({
          where: { discordId: userId },
          create: {
            discordId: userId,
            flags: 0,
          },
          update: {
            discordId: userId,
          },
        });

        const accessToken = await createAccessToken({
          userId: user.id,
          flags: user.flags,
        });

        res.setHeader("Set-Cookie", createAccessTokenCookie(accessToken));

        res.redirect(303, config.DASH_URL);
      } catch (err) {
        console.log(
          `Error logging user in: ${err?.message}\nResponse data:`,
          JSON.stringify(err?.response?.data)
        );

        const status = err?.response?.status ?? 500;
        res.status(status).json({
          status,
          message: "Authentication failed",
        });
      }
    }
  )
);

authRouter.get("/discord-init", async (req, res) => {
  const queryParams = new URLSearchParams({
    client_id: config.DISCORD_CLIENT_ID,
    redirect_uri: config.DISCORD_REDIRECT_URL,
    response_type: "code",
    scope: "identify",
  });

  res.redirect(303, `https://discord.com/api/oauth2/authorize?${queryParams.toString()}`);
});

authRouter.post("/logout", endpointAuth(), async (req, res) => {
  const { userId, jti } = req.tokenPayload;

  await removeJti({ userId, jti });

  res.setHeader("Set-Cookie", createEmptyAccessTokenCookie());
  res.status(200).send();
});

if (config.ENV === "Development") {
  authRouter.post("/dev-login", async (req, res) => {
    try {
      const userId = config.ALLOWED_USER_IDS[0]!;

      const user = await prisma.user.upsert({
        where: { discordId: userId },
        create: {
          discordId: userId,
          flags: 0,
        },
        update: {
          discordId: userId,
        },
      });

      const accessToken = await createAccessToken({
        userId: user.id,
        flags: user.flags,
      });

      res.setHeader("Set-Cookie", createAccessTokenCookie(accessToken));

      res.status(204).send();
    } catch (err) {
      console.log(
        `DEV Error logging user in: ${err?.message}\nResponse data:`,
        JSON.stringify(err?.response?.data)
      );

      const status = err?.response?.status ?? 500;
      res.status(status).json({
        status,
        message: "Authentication failed",
      });
    }
  });
}
