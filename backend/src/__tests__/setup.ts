import db from '../database/db';

// Initialize database before all tests
beforeAll(async () => {
    await db.init();
    console.log('✓ Test database initialized');
});

// Close database connection after all tests
afterAll(async () => {
    await db.close();
    console.log('✓ Test database closed');
});
