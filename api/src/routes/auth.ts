import { config } from "../config";
import prisma from "../data/prisma";
import { endpointAuth } from "../auth/endpointAuth";
import { createAccessToken } from "../auth/jwt";
import { withValidation } from "../utils/withValidation";
import axios from "axios";
import { Router } from "express";
import { z } from "zod";

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
        const tokenResponse = await axios.post(
          `${config.DISCORD_API_BASEURL}/oauth2/token`,
          params.toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const { access_token } = tokenResponse.data;
        if (!access_token) throw new Error("No access token");

        const userResponse = await axios.get(`${config.DISCORD_API_BASEURL}/oauth2/@me`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userId = userResponse?.data?.user?.id;
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

        res.setHeader(
          "Set-Cookie",
          `access-token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 15};${
            config.ENV !== "Development" ? "Secure;" : ""
          }`
        );

        res.redirect(303, "http://localhost:3001/");
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

authRouter.post("/logout", endpointAuth(), async (req, res) => {
  req.session.destroy(() => res.redirect(303, "/"));
});

if (config.ENV === "Development") {
  authRouter.get("/dev", async (req, res) => {
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

      res.setHeader(
        "Set-Cookie",
        `access-token=${accessToken}; Path=/api; HttpOnly; SameSite=Lax; Max-Age=${60 * 15};${
          config.ENV !== "Development" ? "Secure;" : ""
        }`
      );

      res.redirect(303, "http://localhost:3001/");
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
