import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { z } from "zod";

const TursoEnv = z.object({
	TURSO_DATABASE_URL: z.string().url(),
	TURSO_AUTH_TOKEN: z.string(),
});
const ProcessEnv = TursoEnv.parse(process.env);

// for migrations
const migrationClient = createClient({
	url: ProcessEnv.TURSO_DATABASE_URL,
	authToken: ProcessEnv.TURSO_AUTH_TOKEN,
});
await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
console.log("migration complete");
