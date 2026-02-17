import pg from 'pg';

const passwords = ['postgres', 'password', 'admin', 'root', '123456', 'Welcome1'];
const users = ['postgres', 'admin', 'User'];
const dbs = ['postgres', 'trendle'];

async function check(str: string) {
    const pool = new pg.Pool({ connectionString: str, connectionTimeoutMillis: 2000 });
    try {
        const client = await pool.connect();
        console.log(`SUCCESS: ${str}`);
        client.release();
        await pool.end();
        process.exit(0);
    } catch (e: any) {
        // console.log(`Failed: ${str} - ${e.message}`);
        await pool.end();
    }
}

async function run() {
    console.log("Searching for valid credentials...");
    // Try connection without password for ident/trust auth
    await check('postgres://postgres@localhost:5432/postgres');

    for (const u of users) {
        for (const p of passwords) {
            for (const db of dbs) {
                const url = `postgres://${u}:${p}@localhost:5432/${db}`;
                await check(url);
            }
        }
    }
    console.log("No common credentials worked.");
    process.exit(1);
}

run();
