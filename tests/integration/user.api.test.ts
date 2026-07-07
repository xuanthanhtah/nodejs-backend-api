import request from 'supertest';
import { App } from '../../src/app';
import { prisma } from '../../src/infrastructure/database/prisma';

const app = new App().app;

describe('User API Integration Tests', () => {
  beforeAll(async () => {
    // Clear the database before tests
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const userData = {
    email: 'integration@test.com',
    password: 'password123',
    firstName: 'Integration',
    lastName: 'Test',
  };

  let token: string;
  let userId: string;

  describe('POST /api/v1/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(userData.email);
      expect(res.body.data.id).toBeDefined();
    });

    it('should return 400 for validation errors', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({ email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should login and return tokens', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.id).toBeDefined();

      token = res.body.data.accessToken;
      userId = res.body.data.user.id;
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return 401 if unauthorized', async () => {
      const res = await request(app).get('/api/v1/users');
      expect(res.status).toBe(401);
    });

    it('should return list of users when authorized', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.total).toBeGreaterThan(0);
    });
  });
});
