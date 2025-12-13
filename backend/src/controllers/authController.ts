import { Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const authValidation = {
    register: [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').notEmpty().withMessage('Name is required'),
    ],
    login: [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
};

export class AuthController {
    /**
     * Register a new user
     */
    static async register(req: AuthRequest, res: Response) {
        try {
            const { email, password, name, role } = req.body;

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Create new user
            const user = await UserModel.create({
                email,
                password,
                name,
                role: role === 'admin' ? 'admin' : 'user', // Only allow admin if explicitly set
            });

            // Generate JWT token
            const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

            if (!user.id) {
                return res.status(500).json({ error: 'User creation failed' });
            }

            const userId = user.id;
            const userRole: string = user.role;
            const token = (jwt.sign as any)(
                {
                    id: userId,
                    email: user.email,
                    role: userRole
                },
                secret,
                { expiresIn: '24h' }
            ) as string;

            return res.status(201).json({
                token,
                user: {
                    id: userId,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ error: 'Registration failed' });
        }
    }

    /**
     * Login user
     */
    static async login(req: AuthRequest, res: Response) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await UserModel.verifyPassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

            if (!user.id) {
                return res.status(500).json({ error: 'User data invalid' });
            }

            const userId = user.id;
            const userRole: string = user.role;
            const token = (jwt.sign as any)(
                {
                    id: userId,
                    email: user.email,
                    role: userRole
                },
                secret,
                { expiresIn: '24h' }
            ) as string;

            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Login failed' });
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const user = await UserModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            });
        } catch (error) {
            console.error('Get profile error:', error);
            return res.status(500).json({ error: 'Failed to get profile' });
        }
    }
}
