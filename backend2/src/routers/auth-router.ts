import z from "zod";
import { envs } from "../env";
import { publicProcedure, router } from "../trpc";

const params = new URLSearchParams({
	client_id: envs.DISCORD_CLIENT_ID,
	redirect_uri: envs.DISCORD_REDIRECT_URL,
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
				client_id: envs.DISCORD_CLIENT_ID,
				client_secret: envs.DISCORD_CLIENT_SECRET,
				grant_type: "authorization_code",
				code: props.input.code,
				redirect_uri: envs.FRONT_BASE_URL + "/dash/auth/callback",
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
			return { email: userResponseJson.email };
		} else {
			throw new Error("No email");
		}
	}),
});
