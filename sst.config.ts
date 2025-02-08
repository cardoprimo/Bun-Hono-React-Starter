const bucket = new sst.cloudflare.Bucket("MyBucket");

async run() {
  const hono = new sst.cloudflare.Worker("Hono", {
    url: true,
    handler: "index.ts",
    link: [bucket]
  });

const auth = new sst.aws.Auth("MyAuth", {
  issuer: "auth/index.handler",
});

new sst.aws.Nextjs("MyWeb", {
  link: [auth]
});

  return {
    api: hono.url,
  };
}