- [x] setup eslint- run bunx @antfu/eslint-config@latest
- [ ] createApp/ createRouter extract new hono with
  - [ ] loggers
  - [ ] middlewares
  - [ ] strict false
- [ ] appropriate stoker middleware - https://github.com/w3cj/stoker/tree/main/src
  - [x] jsonNotFound
  - [x] jsonOnError
  - [x] httpStatusCodes
  - [x] apiRoute.notfound(jsonNotFound).onError(jsonOnError)
- [ ] middleware file
  - [ ] import clerkMiddleware, create custom logic for getUser from clerk/convex matching
  - [ ] add @hono/sentry `app.use("*", sentry({ dsn: "__YOUR_SENTRY_DSN__" }`
- [ ] add @sentry/bun

```import * as Sentry from "@sentry/bun";

Sentry.init({
  dsn: "__YOUR_SENTRY_DSN__",
  tracesSampleRate: 1.0, // Adjust for performance monitoring
});
```

- [ ] t3-env
- [ ] tan-stack-query/convex links - https://github.com/Balastrong/kickstart/tree/main
- [ ]

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
```
