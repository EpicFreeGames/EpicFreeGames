import { prisma } from "..";
import { config } from "../config";
import { withValidation } from "../utils/withValidation";
import axios from "axios";
import { Router } from "express";
import { z } from "zod";

export const authRouter = Router();

authRouter.get(
  "/callback/discord",
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

        req.session.user = user;
        res.redirect(303, "/dash");
      } catch (err) {
        console.log(err);

        const status = err?.response?.status ?? 500;
        res.status(status).json({
          status,
          message: "Authentication failed",
        });
      }
    }
  )
);
