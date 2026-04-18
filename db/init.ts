import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "progress.db");

export function initDb() {
  const db = new Database(dbPath);

  // Read and execute schema
  const schema = fs.readFileSync(
    path.join(process.cwd(), "db/schema.sql"),
    "utf-8"
  );
  db.exec(schema);

  return db;
}

export function getDb(): Database.Database {
  return new Database(dbPath);
}
