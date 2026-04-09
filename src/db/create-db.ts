import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const connectionString = "postgresql://postgres:admin@localhost:5432/postgres";
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log("Connected to postgres database.");
        
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'bacayuk'");
        if (res.rowCount === 0) {
            console.log("Creating database 'bacayuk'...");
            await client.query("CREATE DATABASE bacayuk");
            console.log("Database 'bacayuk' created successfully.");
        } else {
            console.log("Database 'bacayuk' already exists.");
        }
    } catch (err) {
        console.error("Error creating database:", err);
    } finally {
        await client.end();
    }
}

main();
