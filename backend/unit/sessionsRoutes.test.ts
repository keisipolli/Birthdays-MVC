import request from 'supertest';
import express from 'express';
import sessionsRoutes from '../../backend/routes/sessionsRoutes';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
let app: express.Express;

beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/sessions', sessionsRoutes);
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Sessions Routes', () => {
    it('should create a session upon successful login', async () => {
        // Mock user data
        const userData = {
            id: 1,
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
        };

        // Mock Prisma user.findUnique function
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(userData);

        // Mock bcrypt.compare function
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        // Perform a POST request to /sessions with mock data
        const response = await request(app)
            .post('/sessions')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(userData.id);
    });

    it('should respond with 401 for invalid password', async () => {
        // Mock user data
        const userData = {
            id: 1,
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
        };

        // Mock Prisma user.findUnique function
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(userData);

        // Mock bcrypt.compare function to return false
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        // Perform a POST request to /sessions with mock data
        const response = await request(app)
            .post('/sessions')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
    });

    // Add more test cases as needed

    // ...other tests...
});
