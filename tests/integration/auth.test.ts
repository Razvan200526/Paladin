import { describe, expect, test } from 'bun:test';
import { createApp } from '../../apps/ruby/index';
import { nanoid } from 'nanoid';
import { Client } from 'pg';

describe('Auth Integration Test', () => {
  const app = createApp();
  const testEmail = `test-${nanoid()}@example.com`.toLowerCase();
  const testPassword = 'Password123!';
  let testUser: any;
  let authToken: string;
  let authCookie: string;

  test('POST /api/auth/signup/email creates a user', async () => {
    const res = await app.getAppInstance().request('http://localhost:3000/api/auth/signup/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName: 'Test',
        lastName: 'User',
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(testEmail);
    testUser = body.user;

  });

  test('Manually verify user email', async () => {
    const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/paladin_test' });
    await client.connect();
    await client.query('UPDATE users SET is_email_verified = true WHERE email = $1', [testEmail]);
    await client.end();
  });

  test('POST /api/auth/signin/email logs in the user', async () => {
    const res = await app.getAppInstance().request('http://localhost:3000/api/auth/signin/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.token).toBeDefined();
    expect(body.data.user.id).toBe(testUser.id);
    
    const setCookie = res.headers.get('Set-Cookie');
    if (setCookie) {
        authCookie = setCookie;
    }
    authToken = body.data.token;
  });

  test('GET /api/auth/session returns user session', async () => {
    const res = await app.getAppInstance().request('http://localhost:3000/api/auth/session', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Cookie': authCookie,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.user).toBeDefined();
    expect(body.data.user.email).toBe(testEmail);
  });
});
