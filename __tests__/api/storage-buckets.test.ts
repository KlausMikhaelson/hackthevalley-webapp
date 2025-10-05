import { GET } from '@/app/api/storage/buckets/route';
import { NextRequest } from 'next/server';

// Mock the roasting module to avoid making real API calls during tests
jest.mock('@/lib/roasting', () => ({
  authenticateImplicitWithAdc: jest.fn(),
}));

import { authenticateImplicitWithAdc } from '@/lib/roasting';

describe('GET /api/storage/buckets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return success message when authentication succeeds', async () => {
    (authenticateImplicitWithAdc as jest.Mock).mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/storage/buckets', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: 'Successfully authenticated and listed buckets. Check console for output.'
    });
    expect(authenticateImplicitWithAdc).toHaveBeenCalled();
  });

  it('should return 500 when authentication fails', async () => {
    (authenticateImplicitWithAdc as jest.Mock).mockRejectedValue(new Error('Authentication failed'));

    const request = new NextRequest('http://localhost:3000/api/storage/buckets', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Authentication failed' });
  });
});
