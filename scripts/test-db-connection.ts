import pg from 'pg';
import 'dotenv/config';

console.log("Testing database connection...");
console.log("DATABASE_URL present?", !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
    // Mask password
    const masked = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":****@");
    console.log("Connection string format:", masked.split('@')[1]); // Log host/port only
} else {
    console.error("ERROR: DATABASE_URL is missing from environment.");
    process.exit(1);
}

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(client => {
        console.log("Successfully connected to database!");
        return client.query('SELECT NOW()')
            .then(res => {
                console.log("Query 'SELECT NOW()' successful:", res.rows[0]);
                client.release();
                pool.end();
            });
    })
    .catch(err => {
        console.error("Connection failed:", err.message);
        if (err.code) console.error("Error Code:", err.code);
        pool.end();
    });
