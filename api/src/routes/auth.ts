import axios from "axios";
import { z } from "zod";
import { config } from "../config";

import { Router } from "express";
import { withValidation } from "../utils/withValidation";

export const authRouter = Router();

authRouter.post(
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
