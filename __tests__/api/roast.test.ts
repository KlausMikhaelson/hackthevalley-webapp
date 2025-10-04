import { POST } from '@/app/api/roast/route';
import { NextRequest } from 'next/server';

// Mock the roasting module to avoid making real API calls during tests
jest.mock('@/lib/roasting', () => ({
  roast: jest.fn(),
}));

import { roast } from '@/lib/roasting';

describe('POST /api/roast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return roast result when valid data is provided', async () => {
    const mockResult = 'APPROVED! This purchase is within your budget.';
    (roast as jest.Mock).mockResolvedValue(mockResult);

    const requestBody = {
      items: {
        'Test Item': '$50.00'
      },
      amount: '$1000',
      goals: {
        'savings': ['5000', '12312025']
      }
    };

    const request = new NextRequest('http://localhost:3000/api/roast', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ result: mockResult });
    expect(roast).toHaveBeenCalledWith(
      requestBody.items,
      requestBody.amount,
      requestBody.goals
    );
  });

  it('should return 400 when items is missing', async () => {
    const requestBody = {
      amount: '$1000',
      goals: { 'savings': ['5000', '12312025'] }
    };

    const request = new NextRequest('http://localhost:3000/api/roast', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Missing required fields: items, amount, goals'
    });
    expect(roast).not.toHaveBeenCalled();
  });

  it('should return 400 when amount is missing', async () => {
    const requestBody = {
      items: { 'Test Item': '$50.00' },
      goals: { 'savings': ['5000', '12312025'] }
    };

    const request = new NextRequest('http://localhost:3000/api/roast', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Missing required fields: items, amount, goals'
    });
  });

  it('should return 400 when goals is missing', async () => {
    const requestBody = {
      items: { 'Test Item': '$50.00' },
      amount: '$1000'
    };

    const request = new NextRequest('http://localhost:3000/api/roast', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Missing required fields: items, amount, goals'
    });
  });

  it('should return 500 when roast function throws an error', async () => {
    (roast as jest.Mock).mockRejectedValue(new Error('API Error'));

    const requestBody = {
      items: { 'Test Item': '$50.00' },
      amount: '$1000',
      goals: { 'savings': ['5000', '12312025'] }
    };

    const request = new NextRequest('http://localhost:3000/api/roast', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'API Error' });
  });
});
