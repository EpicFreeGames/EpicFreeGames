import axios from "axios";
import { z } from "zod";
import { config } from "../config";
import { comparePassword } from "../utils/crypto";
import { encryptAccessJwt, encryptRefreshJwt } from "../utils/jwt";

import { Router } from "express";
import { withValidation } from "../utils/withValidation";
import { prisma } from "..";

export const authRouter = Router();

authRouter.post(
  "/login",
  withValidation(
    {
      body: z.object({
        email: z.string(),
        password: z.string(),
      }),
    },
    async (req, res) => {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user)
        return res.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid credentials",
        });

      const isValidPass = await comparePassword(password, user.password);
      if (!isValidPass)
        return res.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid credentials",
        });

      const dbRefreshToken = await prisma.refreshToken.create({
        data: {},
      });

      return res.send({
        accessToken: await encryptAccessJwt({
          userId: user.id,
          email: user.email,
          flags: user.flags,
        }),
        refreshToken: await encryptRefreshJwt({
          userId: user.id,
          email: user.email,
          flags: user.flags,
          jti: dbRefreshToken.id,
        }),
      });
    }
  )
);

authRouter.post(
  "/callback/discord",
  withValidation(
    {
      query: z.object({
        code: z.string(),
      }),
    },
    async (req, res) => {
      const { code } = req.query;

      const params = new URLSearchParams({
        client_id: config.DISCORD_CLIENT_ID,
        client_secret: config.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: `${config.APP_URL}/api/auth/callback/discord`,
      });

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

      const userResponse = await axios.get(
        `${config.DISCORD_API_BASEURL}/oauth2/@me`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log(userResponse.data);

      res.status(200);
    }
  )
);
