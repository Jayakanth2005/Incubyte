import db from './database/db';
import { UserModel } from './models/User';

async function testRegistration() {
    try {
        console.log('Initializing database...');
        await db.init();
        console.log('✓ Database initialized');

        console.log('\nCreating user...');
        const user = await UserModel.create({
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            name: 'Test User',
            role: 'user'
        });

        console.log('✓ User created successfully!');
        console.log('User object:', JSON.stringify(user, null, 2));

        if (!user || !user.id) {
            console.error('❌ User object is missing or has no ID');
            process.exit(1);
        } else {
            console.log('✓ User ID:', user.id);
            console.log('✓ All checks passed!');
            process.exit(0);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testRegistration();
