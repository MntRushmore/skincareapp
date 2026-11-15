import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required. Copy apps/web/.env.example to apps/web/.env.");
  process.exit(1);
}

const schemaPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../db/schema.sql",
);
const schema = readFileSync(schemaPath, "utf8");
const statements = schema
  .split(";")
  .map((statement) => statement.trim())
  .filter((statement) => statement.replace(/--[^\n]*/g, "").trim().length > 0);

const pool = new Pool({ connectionString: databaseUrl });

try {
  for (const statement of statements) {
    await pool.query(statement);
  }
  console.log(`Applied ${statements.length} statements from db/schema.sql`);
} catch (error) {
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
