const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const fs = require("fs");

async function initDb() {
    console.log("Connecting to postgres to check database...");
    const dbConfig = {
        connectionString: process.env.DATABASE_URL,
    };

    // Create a temporary client to connect to default postgres DB
    // Assumes DATABASE_URL points to the target DB 'autoserve', so we might fail if it doesn't exist
    // We need to connect to 'postgres' db first to create 'autoserve'

    const defaultUrl = process.env.DATABASE_URL.replace("/autoserve", "/postgres");
    const client = new Client({ connectionString: defaultUrl });

    try {
        await client.connect();

        // Check if db exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'autoserve'");
        if (res.rowCount === 0) {
            console.log("Database 'autoserve' does not exist. Creating...");
            await client.query("CREATE DATABASE autoserve");
            console.log("Database 'autoserve' created.");
        } else {
            console.log("Database 'autoserve' already exists.");
        }
        await client.end();

        // Now connect to autoserve and run schema
        const pool = new Client({ connectionString: process.env.DATABASE_URL });
        await pool.connect();

        const schemaPath = path.join(__dirname, "../db/database.sql");
        const schema = fs.readFileSync(schemaPath, "utf8");

        // Remove "CREATE DATABASE" line if present since we already handled it or are connected to it
        const schemaQueries = schema.replace(/CREATE DATABASE autoserve;/i, "");

        console.log("Running schema migration...");
        await pool.query(schemaQueries);
        console.log("Schema applied successfully.");

        await pool.end();
    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

initDb();
