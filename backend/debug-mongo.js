const { MongoClient } = require('mongodb');
const dns = require('dns').promises;
require('dotenv').config();

const uri = process.env.MONGO_URI;
// Mask password for logging
const maskedUri = uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED';

async function main() {
    console.log("----------------------------------------");
    console.log("Starting Debug Script");
    console.log("Testing URI:", maskedUri);

    if (!uri) {
        console.error("❌ ERROR: MONGO_URI is not defined in .env");
        process.exit(1);
    }

    try {
        const url = new URL(uri);
        console.log("Hostname:", url.hostname);
        console.log("Database:", url.pathname);

        console.log("\n1. Testing DNS Resolution...");
        try {
            const result = await dns.lookup(url.hostname);
            console.log("✅ DNS Resolved to:", result.address);
        } catch (dnsErr) {
            console.error("❌ DNS Resolution Failed:", dnsErr.message);
            // Don't exit, try connecting anyway just in case host file overrides or similar
        }

        console.log("\n2. Testing MongoDB Connection (Native Driver)...");
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }); // 5s timeout

        try {
            await client.connect();
            console.log("✅ SUCCESS: Connected to MongoDB!");

            const db = client.db();
            const collections = await db.listCollections().toArray();
            console.log("✅ SUCCESS: Listed collections:", collections.map(c => c.name));

            await client.close();
            console.log("✅ Connection closed.");
        } catch (connErr) {
            console.error("\n❌ CONNECTION FAILED:");
            console.error("Name:", connErr.name);
            console.error("Message:", connErr.message);
            if (connErr.code) console.error("Code:", connErr.code);
            if (connErr.codeName) console.error("CodeName:", connErr.codeName);
            if (connErr.cause) console.error("Cause:", connErr.cause);
        }

    } catch (parseErr) {
        console.error("❌ Error parsing URI:", parseErr.message);
    }
    console.log("----------------------------------------");
}

main().catch(console.error);
