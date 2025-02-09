import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { z } from "zod";

const TursoEnv = z.object({
	TURSO_DATABASE_URL: z.string().url(),
	TURSO_AUTH_TOKEN: z.string(),
});
const ProcessEnv = TursoEnv.parse(process.env);

// for query purposes
const queryClient = createClient({
	url: ProcessEnv.TURSO_DATABASE_URL,
	authToken: ProcessEnv.TURSO_AUTH_TOKEN,
});
export const db = drizzle(queryClient);
