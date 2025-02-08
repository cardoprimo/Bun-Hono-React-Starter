const bucket = new sst.cloudflare.Bucket("MyBucket");

async run() {
  const hono = new sst.cloudflare.Worker("Hono", {
    url: true,
    handler: "index.ts",
    link: [bucket]
  });

  return {
    api: hono.url,
  };
}