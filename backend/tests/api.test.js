import 'dotenv/config'; // load .env (JWT_SECRET, ADMIN_*) before the app
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// Integration tests against the real app (dev database).
// Uses unique usernames per run so tests are repeatable.

const uniq = Date.now().toString(36);
const USER = `t_${uniq}`;
const PASS = 'test-password-123';
let userToken = '';
let adminToken = '';
let testOrderId = null;
let createdUserId = null;

const adminAuth = () => `Bearer ${adminToken}`;
const userAuth = () => `Bearer ${userToken}`;

beforeAll(async () => {
  // Admin credentials come from .env (seeded by `npm run seed`)
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass || adminPass === 'change-me') {
    throw new Error('Set ADMIN_PASSWORD in backend/.env and run `npm run seed` before testing');
  }

  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: adminUser, password: adminPass });
  expect(adminRes.status).toBe(200);
  adminToken = adminRes.body.data.token;

  const regRes = await request(app)
    .post('/api/auth/register')
    .send({ username: USER, password: PASS });
  expect(regRes.status).toBe(201);
  createdUserId = regRes.body.data.id;

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: USER, password: PASS });
  expect(loginRes.status).toBe(200);
  userToken = loginRes.body.data.token;
});

describe('health', () => {
  it('responds 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('auth', () => {
  it('rejects short passwords on register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: `s_${uniq}`, password: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects duplicate usernames', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: USER, password: PASS });
    expect(res.status).toBe(400);
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: USER, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('returns a JWT on successful login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: USER, password: PASS });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.password).toBeUndefined(); // never leak the hash
  });
});

describe('route protection', () => {
  it('blocks food creation without a token', async () => {
    const res = await request(app).post('/api/foods').send({ name: 'X' });
    expect(res.status).toBe(401);
  });

  it('blocks food creation with a customer token (403)', async () => {
    const res = await request(app)
      .post('/api/foods')
      .set('Authorization', userAuth())
      .send({ name: 'X' });
    expect(res.status).toBe(403);
  });

  it('blocks the full orders list from customers', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', userAuth());
    expect(res.status).toBe(403);
  });

  it('blocks order status updates from customers', async () => {
    const res = await request(app)
      .put('/api/orders/1/status')
      .set('Authorization', userAuth())
      .send({ status: 'Completed' });
    expect(res.status).toBe(403);
  });

  it('rejects tampered tokens', async () => {
    const res = await request(app)
      .get('/api/orders/mine')
      .set('Authorization', 'Bearer not.a.real.token');
    expect(res.status).toBe(401);
  });

  it('allows the admin to list orders', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', adminAuth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('menu', () => {
  it('lists foods publicly', async () => {
    const res = await request(app).get('/api/foods');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(typeof res.body.data[0].price).toBe('number'); // Decimal serialized
  });

  it('rejects absurd pagination', async () => {
    const res = await request(app).get('/api/foods?limit=99999');
    expect(res.status).toBe(400);
  });

  it('hides unavailable foods from guests even with all=true', async () => {
    // Make a food unavailable as admin
    const list = await request(app)
      .get('/api/foods?all=true&limit=100')
      .set('Authorization', adminAuth());
    const target = list.body.data[0];
    await request(app)
      .put(`/api/foods/${target.id}`)
      .set('Authorization', adminAuth())
      .send({ available: false });

    const guest = await request(app).get('/api/foods?all=true&limit=100');
    expect(guest.body.data.find((f) => f.id === target.id)).toBeUndefined();

    const admin = await request(app)
      .get('/api/foods?all=true&limit=100')
      .set('Authorization', adminAuth());
    expect(admin.body.data.find((f) => f.id === target.id)).toBeTruthy();

    // restore
    await request(app)
      .put(`/api/foods/${target.id}`)
      .set('Authorization', adminAuth())
      .send({ available: true });
  });
});

describe('orders', () => {
  it('rejects non-positive quantities', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', userAuth())
      .send({
        items: [{ foodId: 1, quantity: -3 }],
        customerName: 'Bad',
        customerContact: '09171234567',
      });
    expect(res.status).toBe(400);
  });

  it('rejects missing contact info', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', userAuth())
      .send({ items: [{ foodId: 1, quantity: 1 }], customerName: '', customerContact: '' });
    expect(res.status).toBe(400);
  });

  it('creates an order linked to the logged-in user', async () => {
    const foods = await request(app).get('/api/foods?limit=1');
    const foodId = foods.body.data[0].id;

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', userAuth())
      .send({
        items: [{ foodId, quantity: 2 }],
        customerName: USER,
        customerContact: '09170001111',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.userId).toBe(createdUserId);
    testOrderId = res.body.data.id;
  });

  it('lets the owner read their order but not others', async () => {
    const own = await request(app)
      .get(`/api/orders/${testOrderId}`)
      .set('Authorization', userAuth());
    expect(own.status).toBe(200);

    const other = await request(app)
      .get('/api/orders/999999')
      .set('Authorization', userAuth());
    expect([403, 404]).toContain(other.status);
  });

  it('returns only the caller’s orders from /mine', async () => {
    const res = await request(app)
      .get('/api/orders/mine')
      .set('Authorization', userAuth());
    expect(res.status).toBe(200);
    expect(res.body.data.every((o) => o.userId === createdUserId)).toBe(true);
  });

  it('records status history and keeps cancelled orders', async () => {
    await request(app)
      .put(`/api/orders/${testOrderId}/status`)
      .set('Authorization', adminAuth())
      .send({ status: 'Preparing' });

    const cancel = await request(app)
      .put(`/api/orders/${testOrderId}/status`)
      .set('Authorization', adminAuth())
      .send({ status: 'Cancelled' });
    expect(cancel.status).toBe(200);

    // Still exists (no hard delete)
    const check = await request(app)
      .get(`/api/orders/${testOrderId}`)
      .set('Authorization', adminAuth());
    expect(check.status).toBe(200);
    expect(check.body.data.status).toBe('Cancelled');
    expect(check.body.data.statusHistory.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects unknown status values', async () => {
    const res = await request(app)
      .put(`/api/orders/${testOrderId}/status`)
      .set('Authorization', adminAuth())
      .send({ status: 'Exploded' });
    expect(res.status).toBe(400);
  });

  it('returns stats for the admin dashboard', async () => {
    const res = await request(app)
      .get('/api/orders/stats')
      .set('Authorization', adminAuth());
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('revenue');
    expect(res.body.data).toHaveProperty('byStatus');
    expect(res.body.data).toHaveProperty('topItems');
    expect(res.body.data).toHaveProperty('daily');
    expect(Array.isArray(res.body.data.daily)).toBe(true);
    expect(res.body.data.daily.length).toBe(30);
  });
});

describe('uploads', () => {
  it('requires admin', async () => {
    const res = await request(app)
      .post('/api/upload/image')
      .set('Authorization', userAuth())
      .attach('image', Buffer.from('x'), 'x.png');
    expect(res.status).toBe(403);
  });
});

describe('errors', () => {
  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('does not leak stack traces in the message field', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.body.message).not.toMatch(/at .*\.js:/);
  });
});
