import { describe, expect, test } from 'bun:test';
import { createApp } from '../../apps/ruby/index';

describe('Health Integration Test', () => {
  test('GET /health returns 200 OK', async () => {
    const app = createApp();
    const res = await app
      .getAppInstance()
      .request('http://localhost:3000/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining({ status: 'healthy' }));
  });
});
