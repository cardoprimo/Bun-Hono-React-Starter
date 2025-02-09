import { S3Client } from "bun";

const minio = new S3Client({
  accessKeyId: "access-key",
  secretAccessKey: "secret-key",
  bucket: "my-bucket",

  // Make sure to use the correct endpoint URL
  // It might not be localhost in production!
  endpoint: "http://localhost:9000",
});

