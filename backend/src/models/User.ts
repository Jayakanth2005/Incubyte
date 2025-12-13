import db from '../database/db';
import { User } from './types';
import bcrypt from 'bcrypt';

export class UserModel {
    /**
     * Create a new user
     */
    static async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const result = await db.query(
            `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, role, created_at, updated_at`,
            [user.email, hashedPassword, user.name, user.role || 'user']
        );

        return result.rows[0];
    }

    /**
     * Find user by email
     */
    static async findByEmail(email: string): Promise<User | null> {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        return result.rows[0] || null;
    }

    /**
     * Find user by ID
     */
    static async findById(id: number): Promise<User | null> {
        const result = await db.query(
            'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );

        return result.rows[0] || null;
    }

    /**
     * Verify user password
     */
    static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Get all users (admin only)
     */
    static async findAll(): Promise<Omit<User, 'password'>[]> {
        const result = await db.query(
            'SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC'
        );

        return result.rows;
    }
}
