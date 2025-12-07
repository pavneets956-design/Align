import fs from "node:fs/promises";
import path from "node:path";
import "dotenv/config";

const SUPABASE_URL = required("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE = required("SUPABASE_SERVICE_ROLE");

(async () => {
  const schemaPath = path.resolve(path.join(process.cwd(), "..", "..", "db", "schema.sql"));
  const sql = await fs.readFile(schemaPath, "utf-8");
  console.log(`Executing schema from ${schemaPath}`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pg_execute_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`
    },
    body: JSON.stringify({ query: sql })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Schema execution failed: ${res.status} ${text}`);
  }
  console.log("Schema executed successfully");
})();

function required(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var ${key}`);
  return value;
}
