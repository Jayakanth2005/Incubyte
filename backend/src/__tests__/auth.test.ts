import request from 'supertest';
import app from '../app';

describe('Auth API Integration Tests', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: `test${Date.now()}@example.com`,
                    password: 'password123',
                    name: 'Test User',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email');
            expect(response.body.user).toHaveProperty('name', 'Test User');
            expect(response.body.user).toHaveProperty('role', 'user');
        });

        it('should fail with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'password123',
                    name: 'Test User',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: '123',
                    name: 'Test User',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail when user already exists', async () => {
            const email = `duplicate${Date.now()}@example.com`;

            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    email,
                    password: 'password123',
                    name: 'Test User',
                });

            // Second registration with same email
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email,
                    password: 'password123',
                    name: 'Test User',
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        const testUser = {
            email: `login${Date.now()}@example.com`,
            password: 'password123',
            name: 'Login Test User',
        };

        beforeAll(async () => {
            // Create a test user
            await request(app)
                .post('/api/auth/register')
                .send(testUser);
        });

        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.email).toBe(testUser.email);
        });

        it('should fail with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });

        it('should fail with non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });
    });

    describe('GET /api/auth/profile', () => {
        let token: string;
        const testUser = {
            email: `profile${Date.now()}@example.com`,
            password: 'password123',
            name: 'Profile Test User',
        };

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            token = response.body.token;
        });

        it('should get user profile with valid token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('email', testUser.email);
            expect(response.body).toHaveProperty('name', testUser.name);
        });

        it('should fail without token', async () => {
            const response = await request(app)
                .get('/api/auth/profile');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });
    });
});
