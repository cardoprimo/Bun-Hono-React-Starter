- [ ] setup eslint- run bunx @antfu/eslint-config@latest
- [ ] createApp/ createRouter extract new hono with 
  - [ ] loggers
  - [ ] middlewares
  - [ ] strict false
- [ ] appropriate stoker middleware - https://github.com/w3cj/stoker/tree/main/src
  - [ ] jsonNotFound
  - [ ] jsonOnError
  - [ ] httpStatusCodes
  - [ ] apiRoute.notfound(jsonNotFound).onError(jsonOnError)
- [ ] middleware file
  - [ ] import clerkMiddleware, create custom logic for getUser from clerk/convex matching
  - [ ] add @hono/sentry ``` app.use("*", sentry({ dsn: "__YOUR_SENTRY_DSN__" } ```
- [ ] add @sentry/bun 
``` import * as Sentry from "@sentry/bun";

Sentry.init({
  dsn: "__YOUR_SENTRY_DSN__",
  tracesSampleRate: 1.0, // Adjust for performance monitoring
}); 
```
- [ ] t3-env
- [ ] tan-stack-query/convex links - https://github.com/Balastrong/kickstart/tree/main
- [ ]
