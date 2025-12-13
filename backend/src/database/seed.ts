import db from './db';
import { UserModel } from '../models/User';
import { SweetModel } from '../models/Sweet';

const sampleSweets = [
    {
        name: 'Milk Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100,
        description: 'Smooth and creamy milk chocolate bar',
        image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
    },
    {
        name: 'Gummy Bears',
        category: 'Gummy',
        price: 1.99,
        quantity: 150,
        description: 'Colorful and fruity gummy bears',
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
    },
    {
        name: 'Lollipop',
        category: 'Hard Candy',
        price: 0.99,
        quantity: 200,
        description: 'Classic swirl lollipop',
        image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    },
    {
        name: 'Dark Chocolate Truffle',
        category: 'Chocolate',
        price: 4.99,
        quantity: 50,
        description: 'Rich dark chocolate truffle with cocoa powder',
        image_url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400',
    },
    {
        name: 'Sour Worms',
        category: 'Gummy',
        price: 2.49,
        quantity: 120,
        description: 'Tangy and sour gummy worms',
        image_url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
    },
    {
        name: 'Peppermint Candy',
        category: 'Hard Candy',
        price: 1.49,
        quantity: 180,
        description: 'Refreshing peppermint hard candy',
        image_url: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400',
    },
    {
        name: 'Caramel Chews',
        category: 'Caramel',
        price: 3.49,
        quantity: 80,
        description: 'Soft and chewy caramel candies',
        image_url: 'https://images.unsplash.com/photo-1576717585074-3e5e2d3a6c3f?w=400',
    },
    {
        name: 'Jelly Beans',
        category: 'Jelly',
        price: 2.99,
        quantity: 160,
        description: 'Assorted flavored jelly beans',
        image_url: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
    },
    {
        name: 'White Chocolate Hearts',
        category: 'Chocolate',
        price: 3.99,
        quantity: 70,
        description: 'Heart-shaped white chocolate pieces',
        image_url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400',
    },
    {
        name: 'Cotton Candy',
        category: 'Fluffy',
        price: 1.99,
        quantity: 90,
        description: 'Light and fluffy cotton candy',
        image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    },
];

async function seedDatabase() {
    try {
        // Initialize database
        await db.init();

        console.log('🌱 Starting database seeding...');

        // Create admin user
        console.log('Creating admin user...');
        const adminExists = await UserModel.findByEmail('admin@sweetshop.com');
        let adminId: number;

        if (!adminExists) {
            const admin = await UserModel.create({
                email: 'admin@sweetshop.com',
                password: 'admin123',
                name: 'Admin User',
                role: 'admin',
            });
            adminId = admin.id!;
            console.log('✓ Admin user created');
        } else {
            adminId = adminExists.id!;
            console.log('✓ Admin user already exists');
        }

        // Create regular user
        console.log('Creating regular user...');
        const userExists = await UserModel.findByEmail('user@sweetshop.com');

        if (!userExists) {
            await UserModel.create({
                email: 'user@sweetshop.com',
                password: 'user123',
                name: 'Regular User',
                role: 'user',
            });
            console.log('✓ Regular user created');
        } else {
            console.log('✓ Regular user already exists');
        }

        // Create sample sweets
        console.log('Creating sample sweets...');
        for (const sweet of sampleSweets) {
            await SweetModel.create({
                ...sweet,
                created_by: adminId,
            });
        }
        console.log(`✓ Created ${sampleSweets.length} sample sweets`);

        console.log('');
        console.log('✅ Database seeding completed successfully!');
        console.log('');
        console.log('Test Accounts:');
        console.log('  Admin:');
        console.log('    Email: admin@sweetshop.com');
        console.log('    Password: admin123');
        console.log('  User:');
        console.log('    Email: user@sweetshop.com');
        console.log('    Password: user123');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

export default seedDatabase;
