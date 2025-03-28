- [x] setup eslint- run bunx @antfu/eslint-config@latest
- [x] createApp/ createRouter extract new hono with
  - [x] loggers
  - [ ] middlewares
    - [ ] check if custom user set before anything
  - [x] strict false
- [x] appropriate stoker middleware - https://github.com/w3cj/stoker/tree/main/src
  - [x] jsonNotFound
  - [x] jsonOnError
  - [x] httpStatusCodes
  - [x] apiRoute.notfound(jsonNotFound).onError(jsonOnError)
- [x] middleware file
  - [x] import clerkMiddleware, create custom logic for getUser from clerk/convex matching
  - [x] createConvexUserFromClerk
  - [ ] add @hono/sentry `app.use("*", sentry({ dsn: "__YOUR_SENTRY_DSN__" }`
- [ ] add @sentry/bun

```import * as Sentry from "@sentry/bun";

Sentry.init({
  dsn: "__YOUR_SENTRY_DSN__",
  tracesSampleRate: 1.0, // Adjust for performance monitoring
});
```

- [x] t3-env
- [ ] tan-stack-query/convex links - https://github.com/Balastrong/kickstart/tree/main
- [ ] create single convexClient\
- [ ] extract api.to convex httpAcrions see honowithconvex helper -https://docs.convex.dev/functions/http-actions

````
import { Hono } from "hono";
import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { ActionCtx } from "./_generated/server";

const app: HonoWithConvex<ActionCtx> = new Hono();

// Define routes
app.get("/listMessages/:userId", async (c) => {
   const userId = c.req.param("userId");
   const messages = await c.env.runQuery(api.messages.getByAuthor, { authorNumber: userId });
   return c.json(messages);
});

export default new HttpRouterWithHono(app);


```const app = new Hono();

const authMiddleware = async (c, next) => {
 const token = c.req.header('Authorization');
 if (!token) return c.json({ error: 'Unauthorized' }, 401);

 const user = await verifyToken(token);
 if (!user) return c.json({ error: 'Invalid Token' }, 401);

 c.set('user', user);
 await next();
};

// Layout with protected routes
app.route('/app', (route) => {
 route.get('/', (c) => c.text('Public App Home Page'));

 // Protect dashboard routes
 route.group('/dashboard', (dashboard) => {
   dashboard.use('*', authMiddleware); // Apply middleware to all dashboard routes

   dashboard.get('/', (c) => {
     const user = c.get('user');
     return c.text(`Welcome to your Dashboard, ${user.name}`);
   });

   dashboard.get('/settings', (c) => {
     const user = c.get('user');
     return c.text(`Settings for ${user.name}`);
   });
 });
});

export default app;
````
