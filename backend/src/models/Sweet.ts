import db from '../database/db';
import { Sweet } from './types';

export class SweetModel {
    /**
     * Create a new sweet
     */
    static async create(sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>): Promise<Sweet> {
        const result = await db.query(
            `INSERT INTO sweets (name, category, price, quantity, description, image_url, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
            [
                sweet.name,
                sweet.category,
                sweet.price,
                sweet.quantity,
                sweet.description || null,
                sweet.image_url || null,
                sweet.created_by || null
            ]
        );

        return result.rows[0];
    }

    /**
     * Get all sweets
     */
    static async findAll(): Promise<Sweet[]> {
        const result = await db.query(
            'SELECT * FROM sweets ORDER BY created_at DESC'
        );

        return result.rows;
    }

    /**
     * Find sweet by ID
     */
    static async findById(id: number): Promise<Sweet | null> {
        const result = await db.query(
            'SELECT * FROM sweets WHERE id = $1',
            [id]
        );

        return result.rows[0] || null;
    }

    /**
     * Search sweets by name, category, or price range
     */
    static async search(params: {
        name?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<Sweet[]> {
        let query = 'SELECT * FROM sweets WHERE 1=1';
        const values: any[] = [];
        let paramCount = 1;

        if (params.name) {
            query += ` AND name ILIKE $${paramCount}`;
            values.push(`%${params.name}%`);
            paramCount++;
        }

        if (params.category) {
            query += ` AND category ILIKE $${paramCount}`;
            values.push(`%${params.category}%`);
            paramCount++;
        }

        if (params.minPrice !== undefined) {
            query += ` AND price >= $${paramCount}`;
            values.push(params.minPrice);
            paramCount++;
        }

        if (params.maxPrice !== undefined) {
            query += ` AND price <= $${paramCount}`;
            values.push(params.maxPrice);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, values);
        return result.rows;
    }

    /**
     * Update sweet
     */
    static async update(id: number, updates: Partial<Sweet>): Promise<Sweet | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (updates.name !== undefined) {
            fields.push(`name = $${paramCount}`);
            values.push(updates.name);
            paramCount++;
        }

        if (updates.category !== undefined) {
            fields.push(`category = $${paramCount}`);
            values.push(updates.category);
            paramCount++;
        }

        if (updates.price !== undefined) {
            fields.push(`price = $${paramCount}`);
            values.push(updates.price);
            paramCount++;
        }

        if (updates.quantity !== undefined) {
            fields.push(`quantity = $${paramCount}`);
            values.push(updates.quantity);
            paramCount++;
        }

        if (updates.description !== undefined) {
            fields.push(`description = $${paramCount}`);
            values.push(updates.description);
            paramCount++;
        }

        if (updates.image_url !== undefined) {
            fields.push(`image_url = $${paramCount}`);
            values.push(updates.image_url);
            paramCount++;
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `UPDATE sweets SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await db.query(query, values);

        return result.rows[0] || null;
    }

    /**
     * Delete sweet
     */
    static async delete(id: number): Promise<boolean> {
        const result = await db.query(
            'DELETE FROM sweets WHERE id = $1',
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }

    /**
     * Update quantity (for purchase/restock)
     */
    static async updateQuantity(id: number, quantityChange: number): Promise<Sweet | null> {
        const result = await db.query(
            `UPDATE sweets 
       SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
            [quantityChange, id]
        );

        return result.rows[0] || null;
    }
}
