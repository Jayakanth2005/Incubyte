import { Response } from 'express';
import { body, query } from 'express-validator';
import { SweetModel } from '../models/Sweet';
import { AuthRequest } from '../middleware/auth';

export const sweetValidation = {
    create: [
        body('name').notEmpty().withMessage('Name is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    ],
    update: [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('category').optional().notEmpty().withMessage('Category cannot be empty'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    ],
    search: [
        query('name').optional().isString(),
        query('category').optional().isString(),
        query('minPrice').optional().isFloat({ min: 0 }),
        query('maxPrice').optional().isFloat({ min: 0 }),
    ],
    purchase: [
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
    restock: [
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    ],
};

export class SweetController {
    /**
     * Create a new sweet (Admin only)
     */
    static async create(req: AuthRequest, res: Response) {
        try {
            const { name, category, price, quantity, description, image_url } = req.body;

            const sweet = await SweetModel.create({
                name,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                description,
                image_url,
                created_by: req.user?.id,
            });

            return res.status(201).json(sweet);
        } catch (error) {
            console.error('Create sweet error:', error);
            return res.status(500).json({ error: 'Failed to create sweet' });
        }
    }

    /**
     * Get all sweets
     */
    static async getAll(_req: AuthRequest, res: Response) {
        try {
            const sweets = await SweetModel.findAll();
            return res.status(200).json(sweets);
        } catch (error) {
            console.error('Get all sweets error:', error);
            return res.status(500).json({ error: 'Failed to fetch sweets' });
        }
    }

    /**
     * Get sweet by ID
     */
    static async getById(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const sweet = await SweetModel.findById(id);

            if (!sweet) {
                return res.status(404).json({ error: 'Sweet not found' });
            }

            return res.status(200).json(sweet);
        } catch (error) {
            console.error('Get sweet by ID error:', error);
            return res.status(500).json({ error: 'Failed to fetch sweet' });
        }
    }

    /**
     * Search sweets
     */
    static async search(req: AuthRequest, res: Response) {
        try {
            const { name, category, minPrice, maxPrice } = req.query;

            const sweets = await SweetModel.search({
                name: name as string,
                category: category as string,
                minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            });

            return res.status(200).json(sweets);
        } catch (error) {
            console.error('Search sweets error:', error);
            return res.status(500).json({ error: 'Failed to search sweets' });
        }
    }

    /**
     * Update sweet (Admin only)
     */
    static async update(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const updates = req.body;

            // Convert string numbers to proper types
            if (updates.price) updates.price = parseFloat(updates.price);
            if (updates.quantity) updates.quantity = parseInt(updates.quantity);

            const sweet = await SweetModel.update(id, updates);

            if (!sweet) {
                return res.status(404).json({ error: 'Sweet not found' });
            }

            return res.status(200).json(sweet);
        } catch (error) {
            console.error('Update sweet error:', error);
            return res.status(500).json({ error: 'Failed to update sweet' });
        }
    }

    /**
     * Delete sweet (Admin only)
     */
    static async delete(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await SweetModel.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Sweet not found' });
            }

            return res.status(200).json({ message: 'Sweet deleted successfully' });
        } catch (error) {
            console.error('Delete sweet error:', error);
            return res.status(500).json({ error: 'Failed to delete sweet' });
        }
    }

    /**
     * Purchase a sweet
     */
    static async purchase(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { quantity } = req.body;
            const purchaseQuantity = parseInt(quantity);

            // Check if sweet exists and has enough quantity
            const sweet = await SweetModel.findById(id);
            if (!sweet) {
                return res.status(404).json({ error: 'Sweet not found' });
            }

            if (sweet.quantity < purchaseQuantity) {
                return res.status(400).json({ error: 'Insufficient quantity in stock' });
            }

            // Update quantity
            const updatedSweet = await SweetModel.updateQuantity(id, -purchaseQuantity);

            return res.status(200).json({
                message: 'Purchase successful',
                sweet: updatedSweet,
                purchased: purchaseQuantity,
                totalPrice: sweet.price * purchaseQuantity,
            });
        } catch (error) {
            console.error('Purchase sweet error:', error);
            return res.status(500).json({ error: 'Failed to purchase sweet' });
        }
    }

    /**
     * Restock a sweet (Admin only)
     */
    static async restock(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { quantity } = req.body;
            const restockQuantity = parseInt(quantity);

            const sweet = await SweetModel.findById(id);
            if (!sweet) {
                return res.status(404).json({ error: 'Sweet not found' });
            }

            const updatedSweet = await SweetModel.updateQuantity(id, restockQuantity);

            return res.status(200).json({
                message: 'Restock successful',
                sweet: updatedSweet,
                restocked: restockQuantity,
            });
        } catch (error) {
            console.error('Restock sweet error:', error);
            return res.status(500).json({ error: 'Failed to restock sweet' });
        }
    }
}
