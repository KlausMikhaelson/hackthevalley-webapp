import { POST } from '@/app/api/categorize/route';
import { NextRequest } from 'next/server';

// Mock the roasting module to avoid making real API calls during tests
jest.mock('@/lib/roasting', () => ({
  categorize: jest.fn(),
}));

import { categorize } from '@/lib/roasting';

describe('POST /api/categorize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return categorized items when valid data is provided', async () => {
    const mockCategories = {
      fashion: [
        { item: 'Nike Shoes', price: '$120.00' }
      ],
      food: [
        { item: 'Pizza', price: '$15.99' }
      ]
    };
    (categorize as jest.Mock).mockResolvedValue(mockCategories);

    const requestBody = {
      items: {
        'Nike Shoes': '$120.00',
        'Pizza': '$15.99'
      }
    };

    const request = new NextRequest('http://localhost:3000/api/categorize', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ categories: mockCategories });
    expect(categorize).toHaveBeenCalledWith(requestBody.items);
  });

  it('should return 400 when items is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/categorize', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Missing required field: items'
    });
    expect(categorize).not.toHaveBeenCalled();
  });

  it('should return 500 when categorize function throws an error', async () => {
    (categorize as jest.Mock).mockRejectedValue(new Error('Categorization failed'));

    const requestBody = {
      items: { 'Test Item': '$50.00' }
    };

    const request = new NextRequest('http://localhost:3000/api/categorize', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Categorization failed' });
  });

  it('should handle empty items object', async () => {
    (categorize as jest.Mock).mockResolvedValue({});

    const requestBody = { items: {} };

    const request = new NextRequest('http://localhost:3000/api/categorize', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ categories: {} });
  });
});
