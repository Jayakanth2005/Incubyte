import db from './db';

const createTables = async () => {
    try {
        // Initialize database
        await db.init();

        console.log('Starting database migration...');

        // Create users table
        db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('✓ Users table created');

        // Create sweets table
        db.query(`
      CREATE TABLE IF NOT EXISTS sweets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        description TEXT,
        image_url TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

        console.log('✓ Sweets table created');

        // Create purchases table
        db.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        sweet_id INTEGER,
        quantity INTEGER NOT NULL,
        total_price REAL NOT NULL,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (sweet_id) REFERENCES sweets(id)
      )
    `);

        console.log('✓ Purchases table created');

        // Create indexes
        db.query(`CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category)`);
        db.query(`CREATE INDEX IF NOT EXISTS idx_sweets_name ON sweets(name)`);
        db.query(`CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id)`);

        console.log('✓ Indexes created');

        console.log('Database migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
};

// Run migration if this file is executed directly
if (require.main === module) {
    createTables()
        .then(() => {
            console.log('Migration script finished');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration script failed:', error);
            process.exit(1);
        });
}

export default createTables;
