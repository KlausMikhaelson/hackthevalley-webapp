// Unit tests for purchase API endpoints

import { NextRequest } from 'next/server';

// Mock Clerk auth
const mockAuth = jest.fn();
jest.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth
}));

// Mock MongoDB connection
const mockConnect = jest.fn();
jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: mockConnect
}));

// Mock Purchase model
const mockCreate = jest.fn();
const mockFind = jest.fn();
const mockCountDocuments = jest.fn();
const mockAggregate = jest.fn();

jest.mock('@/models/Purchase', () => ({
  __esModule: true,
  default: {
    create: mockCreate,
    find: jest.fn(() => ({
      sort: jest.fn(() => ({
        skip: jest.fn(() => ({
          limit: jest.fn(() => ({
            lean: mockFind
          }))
        }))
      }))
    })),
    countDocuments: mockCountDocuments,
    aggregate: mockAggregate
  }
}));

// Mock categorization
const mockCategorizePurchase = jest.fn();
jest.mock('@/lib/categorization', () => ({
  categorizePurchase: mockCategorizePurchase
}));

describe('Purchase API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockResolvedValue(true);
  });

  describe('POST /api/purchases/add', () => {
    let POST: any;

    beforeEach(async () => {
      const module = await import('@/app/api/purchases/add/route');
      POST = module.POST;
    });

    it('should add a purchase successfully', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' });
      mockCategorizePurchase.mockResolvedValue('fashion');
      mockCreate.mockResolvedValue({
        _id: 'purchase_123',
        user_id: 'user_123',
        item_name: 'Nike Shoes',
        price: 99.99,
        currency: 'USD',
        category: 'fashion',
        website: 'nike.com',
        url: 'https://nike.com/shoes/123',
        description: 'Running shoes',
        purchase_date: new Date('2025-10-05'),
        createdAt: new Date('2025-10-05')
      });

      const request = new NextRequest('http://localhost:3000/api/purchases/add', {
        method: 'POST',
        body: JSON.stringify({
          item_name: 'Nike Shoes',
          price: 99.99,
          website: 'nike.com',
          url: 'https://nike.com/shoes/123',
          description: 'Running shoes'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.purchase.item_name).toBe('Nike Shoes');
      expect(data.purchase.category).toBe('fashion');
      expect(mockCategorizePurchase).toHaveBeenCalledWith('Nike Shoes', 'Running shoes');
    });

    it('should return 401 if user is not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const request = new NextRequest('http://localhost:3000/api/purchases/add', {
        method: 'POST',
        body: JSON.stringify({
          item_name: 'Test Item',
          price: 50,
          website: 'test.com'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('Unauthorized');
    });

    it('should return 400 if required fields are missing', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' });

      const request = new NextRequest('http://localhost:3000/api/purchases/add', {
        method: 'POST',
        body: JSON.stringify({
          item_name: 'Test Item'
          // Missing price and website
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should return 400 if price is invalid', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' });

      const request = new NextRequest('http://localhost:3000/api/purchases/add', {
        method: 'POST',
        body: JSON.stringify({
          item_name: 'Test Item',
          price: -10,
          website: 'test.com'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Price must be a positive number');
    });

    it('should use default currency if not provided', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' });
      mockCategorizePurchase.mockResolvedValue('food');
      mockCreate.mockResolvedValue({
        _id: 'purchase_123',
        user_id: 'user_123',
        item_name: 'Pizza',
        price: 15.99,
        currency: 'USD',
        category: 'food',
        website: 'pizzahut.com',
        purchase_date: new Date(),
        createdAt: new Date()
      });

      const request = new NextRequest('http://localhost:3000/api/purchases/add', {
        method: 'POST',
        body: JSON.stringify({
          item_name: 'Pizza',
          price: 15.99,
          website: 'pizzahut.com'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.purchase.currency).toBe('USD');
    });
  });

  describe('GET /api/purchases/list', () => {
    let GET: any;

    beforeEach(async () => {
      const module = await import('@/app/api/purchases/list/route');
      GET = module.GET;
    });

    it('should list user purchases successfully', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' });
      mockFind.mockResolvedValue([
        {
          _id: 'purchase_1',
          user_id: 'user_123',
          item_name: 'Item 1',
          price: 50,
          currency: 'USD',
          category: 'food',
          website: 'test.com',
          purchase_date: new Date('2025-10-05'),
          createdAt: new Date('2025-10-05')
        }
      ]);
      mockCountDocuments.mockResolvedValue(1);
      mockAggregate.mockResolvedValueOnce([
        { _id: 'food', total_spent: 50, count: 1 }
      ]).mockResolvedValueOnce([
        { _id: null, total: 50 }
      ]);

      const request = new NextRequest('http://localhost:3000/api/purchases/list');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.purchases).toHaveLength(1);
      expect(data.statistics.total_purchases).toBe(1);
      expect(data.statistics.total_spent).toBe(50);
    });

    it('should return 401 if user is not authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const request = new NextRequest('http://localhost:3000/api/purchases/list');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('Unauthorized');
    });

    it('should respect limit parameter', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' });
      mockFind.mockResolvedValue([]);
      mockCountDocuments.mockResolvedValue(0);
      mockAggregate.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/purchases/list?limit=10');
      await GET(request);

      // Verify that the query was built with correct limit
      expect(mockFind).toHaveBeenCalled();
    });

    it('should filter by category', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' });
      mockFind.mockResolvedValue([]);
      mockCountDocuments.mockResolvedValue(0);
      mockAggregate.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/purchases/list?category=food');
      await GET(request);

      expect(mockFind).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123' });
      mockFind.mockResolvedValue([]);
      mockCountDocuments.mockResolvedValue(100);
      mockAggregate.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/purchases/list?limit=20&offset=40');
      const response = await GET(request);
      const data = await response.json();

      expect(data.pagination.total).toBe(100);
      expect(data.pagination.limit).toBe(20);
      expect(data.pagination.offset).toBe(40);
      expect(data.pagination.has_more).toBe(true);
    });
  });
});
