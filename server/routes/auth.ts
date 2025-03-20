import { Hono } from "hono";

import { kindeClient, sessionManager } from "../kinde";
import { getUser } from "../kinde";
import { unknown } from "zod";

export const authRoute = new Hono()
	.get("/login", async (c) => {
		const loginUrl = await kindeClient.login(sessionManager(c));
		return c.redirect(loginUrl.toString());
	})
	.get("/register", async (c) => {
		const registerUrl = await kindeClient.register(sessionManager(c));
		return c.redirect(registerUrl.toString());
	})
	.get("/callback", async (c) => {
		// get called eveyr time we login or register
		const url = new globalThis.URL(c.req.url) as unknown as globalThis.URL;
		console.log("url", url);
		await kindeClient.handleRedirectToApp(sessionManager(c), url);
		return c.redirect("/");
	})
	.get("/logout", async (c) => {
		const logoutUrl = await kindeClient.logout(sessionManager(c));
		return c.redirect(logoutUrl.toString());
	})
	.get("/me", getUser, async (c) => {
		const user = c.var.user;
		return c.json({ user });
	});
