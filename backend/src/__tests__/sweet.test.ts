import request from 'supertest';
import app from '../app';

describe('Sweet API Integration Tests', () => {
    let userToken: string;
    let adminToken: string;
    let sweetId: number;

    beforeAll(async () => {
        // Create regular user
        const userResponse = await request(app)
            .post('/api/auth/register')
            .send({
                email: `user${Date.now()}@example.com`,
                password: 'password123',
                name: 'Regular User',
            });
        userToken = userResponse.body.token;

        // Create admin user
        const adminResponse = await request(app)
            .post('/api/auth/register')
            .send({
                email: `admin${Date.now()}@example.com`,
                password: 'password123',
                name: 'Admin User',
                role: 'admin',
            });
        adminToken = adminResponse.body.token;
    });

    describe('POST /api/sweets', () => {
        it('should create a sweet as admin', async () => {
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Chocolate Bar',
                    category: 'Chocolate',
                    price: 2.99,
                    quantity: 100,
                    description: 'Delicious chocolate bar',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', 'Chocolate Bar');
            expect(response.body).toHaveProperty('category', 'Chocolate');
            expect(response.body).toHaveProperty('price');
            expect(response.body).toHaveProperty('quantity', 100);

            sweetId = response.body.id;
        });

        it('should fail to create sweet as regular user', async () => {
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Gummy Bears',
                    category: 'Gummy',
                    price: 1.99,
                    quantity: 50,
                });

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/sweets')
                .send({
                    name: 'Lollipop',
                    category: 'Hard Candy',
                    price: 0.99,
                    quantity: 200,
                });

            expect(response.status).toBe(401);
        });

        it('should fail with invalid data', async () => {
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: '',
                    category: 'Chocolate',
                    price: -5,
                    quantity: 'invalid',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/sweets', () => {
        it('should get all sweets', async () => {
            const response = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/sweets');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/sweets/:id', () => {
        it('should get sweet by id', async () => {
            const response = await request(app)
                .get(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', sweetId);
            expect(response.body).toHaveProperty('name');
        });

        it('should return 404 for non-existent sweet', async () => {
            const response = await request(app)
                .get('/api/sweets/99999')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('GET /api/sweets/search', () => {
        it('should search sweets by name', async () => {
            const response = await request(app)
                .get('/api/sweets/search?name=Chocolate')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should search sweets by category', async () => {
            const response = await request(app)
                .get('/api/sweets/search?category=Chocolate')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should search sweets by price range', async () => {
            const response = await request(app)
                .get('/api/sweets/search?minPrice=1&maxPrice=5')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('PUT /api/sweets/:id', () => {
        it('should update sweet as admin', async () => {
            const response = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Chocolate Bar',
                    price: 3.49,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'Updated Chocolate Bar');
            expect(response.body.price).toBe('3.49');
        });

        it('should fail to update as regular user', async () => {
            const response = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Hacked Sweet',
                });

            expect(response.status).toBe(403);
        });
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should purchase sweet successfully', async () => {
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    quantity: 5,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Purchase successful');
            expect(response.body).toHaveProperty('purchased', 5);
            expect(response.body).toHaveProperty('totalPrice');
        });

        it('should fail with insufficient quantity', async () => {
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    quantity: 1000,
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Insufficient quantity in stock');
        });

        it('should fail with invalid quantity', async () => {
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    quantity: 0,
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/sweets/:id/restock', () => {
        it('should restock sweet as admin', async () => {
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    quantity: 50,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Restock successful');
            expect(response.body).toHaveProperty('restocked', 50);
        });

        it('should fail to restock as regular user', async () => {
            const response = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    quantity: 50,
                });

            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /api/sweets/:id', () => {
        it('should fail to delete as regular user', async () => {
            const response = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
        });

        it('should delete sweet as admin', async () => {
            const response = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Sweet deleted successfully');
        });

        it('should return 404 for already deleted sweet', async () => {
            const response = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
        });
    });
});
