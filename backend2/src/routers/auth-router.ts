import z from "zod";
import { publicProcedure, router } from "../trpc";
import { envs } from "../configuration/env";
import { createToken } from "../auth";

const redirectUrl = envs.FRONT_BASE + "/dash/auth/callback";

const params = new URLSearchParams({
	client_id: envs.DC_CLIENT_ID,
	redirect_uri: redirectUrl,
	response_type: "code",
	scope: "identify email",
	promt: "consent",
});

const authInitUrl = "https://discord.com/oauth2/authorize" + "?" + params.toString();

export const authRouter = router({
	getAuthInitUrl: publicProcedure.query(() => {
		return authInitUrl;
	}),
	verifyCode: publicProcedure.input(z.object({ code: z.string() })).mutation(async (props) => {
		const codeResponse = await fetch("https://discord.com/api/oauth2/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: envs.DC_CLIENT_ID,
				client_secret: envs.DC_CLIENT_SECRET,
				grant_type: "authorization_code",
				code: props.input.code,
				redirect_uri: redirectUrl,
			}),
		});
		const codeResponseJson = await codeResponse.json();

		const userResponse = await fetch("https://discord.com/api/users/@me", {
			headers: {
				authorization: `${codeResponseJson.token_type} ${codeResponseJson.access_token}`,
			},
		});
		const userResponseJson = await userResponse.json();

		if (!!userResponseJson.email) {
			const token = await createToken(userResponseJson.email);
			props.ctx.res.setHeader(
				"Set-Cookie",
				`token=${token}; HttpOnly; SameSite=Strict; Path=/;`
			);
			return { email: userResponseJson.email };
		} else {
			throw new Error("No email");
		}
	}),
});
