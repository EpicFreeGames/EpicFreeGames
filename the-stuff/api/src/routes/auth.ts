import { Router } from "express";
import { z } from "zod";

import { createAccessTokenCookie, createEmptyAccessTokenCookie } from "../auth/cookie";
import { endpointAuth } from "../auth/endpointAuth";
import { createAccessToken } from "../auth/jwt/jwt";
import { config } from "../config";
import prisma from "../data/prisma";
import { prismaUpdateCatcher } from "../data/prismaUpdateCatcher";
import { withValidation } from "../utils/withValidation";

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

      const user = (await userResponse.json())?.user;
      const userId = user?.id;
      const username = `${user?.username}#${user?.discriminator}`;

      if (!userId || username.length === 1)
        return res.status(500).json({
          statusCode: 500,
          error: "Invalid user response from Discord",
          message: "Invalid user response from Discord",
        });

      const dbUser = await prisma.user
        .update({
          where: { identifier: userId },
          data: { name: username },
        })
        .catch(prismaUpdateCatcher);

      if (!dbUser)
        return res.status(404).json({
          statusCode: 404,
          error: "Not found",
          message: "User not found",
        });

      const accessToken = await createAccessToken({
        userId: dbUser.id,
        flags: dbUser.flags,
      });

      res.setHeader("Set-Cookie", createAccessTokenCookie(accessToken));

      res.redirect(303, config.DASH_URL);
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
  res.setHeader("Set-Cookie", createEmptyAccessTokenCookie());
  res.status(200).send();
});
