import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database location
const dbPath = path.resolve(__dirname, "../../data/calabarhomes.db");

// Ensure the data directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

console.log("Initializing database...");
console.log("Database path:", dbPath);


// Create database connection
const db = new Database(dbPath);
// Database configuration
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");


console.log("Database connection opened.");


try{

    // Optional performance settings
    db.pragma("synchronous = NORMAL");

    // auth and user tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        fullname TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'tenant' CHECK (role IN ('tenant', 'landlord', 'admin')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        token TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        expires_at TEXT NOT NULL,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    );
    `);

    // business
    db.exec(`
        CREATE TABLE IF NOT EXISTS enquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone_num TEXT NOT NULL,
        email TEXT NOT NULL,
        messsage TEXT NOT NULL,
        property_id TEXT NOT NULL,

        FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE

        );
         CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            location TEXT NOT NULL,
            rent_per_year TEXT,
            rent_per_month TEXT,
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'denied', 'approved', 'inactive', 'active', 'rented')),
            profile_pics TEXT DEFAULT '{}',
            name TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
        );`);
        console.log("Tables created successfully.");
 const tables = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type = 'table'
    `).all();

    console.log("Existing tables:", tables);
}catch (error) {
    console.error("Error initializing database schema:", error);
    process.exit(1);
}
export default db;