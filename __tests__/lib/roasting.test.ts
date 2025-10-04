// Unit tests for roasting.ts functions
// Note: These tests require mocking the Google AI SDK

// Mock the Google AI SDK before requiring the module
const mockGenerateContent = jest.fn();

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent
    }
  }))
}));

// Mock Google Cloud Storage
jest.mock("@google-cloud/storage", () => ({
  Storage: jest.fn().mockImplementation(() => ({
    getBuckets: jest.fn().mockResolvedValue([[
      { name: 'test-bucket-1' },
      { name: 'test-bucket-2' }
    ]])
  }))
}));

import { roast, categorize, authenticateImplicitWithAdc } from '@/lib/roasting';

describe('Roasting Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('roast()', () => {
    it('should return AI-generated roast response', async () => {
      const mockResponse = {
        text: 'APPROVED! This purchase is within your budget and aligns with your goals.'
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const items = {
        'Budget Laptop': '$500.00'
      };
      const amount = '$2000';
      const goals = {
        'savings': ['5000', '12312025'] as [string, string]
      };

      const result = await roast(items, amount, goals);

      expect(result).toBe(mockResponse.text);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash',
          maxOutputTokens: 1000
        })
      );
    });

    it('should format items and goals correctly in the prompt', async () => {
      const mockResponse = { text: 'Test response' };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const items = {
        'Item 1': '$100',
        'Item 2': '$200'
      };
      const amount = '$1000';
      const goals = {
        'goal1': ['500', '01012026'] as [string, string],
        'goal2': ['1000', '12312026'] as [string, string]
      };

      await roast(items, amount, goals);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain('Item 1 for $100');
      expect(callArgs.contents).toContain('Item 2 for $200');
      expect(callArgs.contents).toContain('500 for goal1 by 01012026');
      expect(callArgs.contents).toContain('1000 for goal2 by 12312026');
    });

    it('should handle empty items', async () => {
      const mockResponse = { text: 'No items to roast' };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await roast({}, '$1000', {});

      expect(result).toBe(mockResponse.text);
    });
  });

  describe('categorize()', () => {
    it('should categorize items into spending categories', async () => {
      // Mock different responses for different items
      mockGenerateContent
        .mockResolvedValueOnce({ text: 'fashion' })
        .mockResolvedValueOnce({ text: 'food' })
        .mockResolvedValueOnce({ text: 'entertainment' });

      const items = {
        'Nike Shoes': '$120.00',
        'Pizza': '$15.99',
        'Movie Ticket': '$12.50'
      };

      const result = await categorize(items);

      expect(result).toEqual({
        fashion: [{ item: 'Nike Shoes', price: '$120.00' }],
        food: [{ item: 'Pizza', price: '$15.99' }],
        entertainment: [{ item: 'Movie Ticket', price: '$12.50' }]
      });

      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
    });

    it('should group multiple items in the same category', async () => {
      mockGenerateContent
        .mockResolvedValueOnce({ text: 'food' })
        .mockResolvedValueOnce({ text: 'food' });

      const items = {
        'Pizza': '$15.99',
        'Burger': '$10.99'
      };

      const result = await categorize(items);

      expect(result.food).toHaveLength(2);
      expect(result.food).toContainEqual({ item: 'Pizza', price: '$15.99' });
      expect(result.food).toContainEqual({ item: 'Burger', price: '$10.99' });
    });

    it('should handle category names with periods and whitespace', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: 'food.' });

      const items = {
        'Pizza': '$15.99'
      };

      const result = await categorize(items);

      expect(result).toHaveProperty('food');
      expect(result.food).toContainEqual({ item: 'Pizza', price: '$15.99' });
    });

    it('should return empty object for empty items', async () => {
      const result = await categorize({});

      expect(result).toEqual({});
      expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it('should call AI with correct categorization prompt', async () => {
      mockGenerateContent.mockResolvedValue({ text: 'fashion' });

      await categorize({ 'Test Item': '$50' });

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain('Categorize Test Item');
      expect(callArgs.contents).toContain('food, fashion, entertainment, transport, travel or living');
      expect(callArgs.maxOutputTokens).toBe(10);
    });
  });

  describe('authenticateImplicitWithAdc()', () => {
    it('should successfully authenticate and list buckets', async () => {
      // Mock console.log to verify output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await authenticateImplicitWithAdc();

      expect(consoleSpy).toHaveBeenCalledWith('Buckets:');
      expect(consoleSpy).toHaveBeenCalledWith('- test-bucket-1');
      expect(consoleSpy).toHaveBeenCalledWith('- test-bucket-2');
      expect(consoleSpy).toHaveBeenCalledWith('Listed all storage buckets.');

      consoleSpy.mockRestore();
    });

    it('should handle storage errors', async () => {
      const { Storage } = require('@google-cloud/storage');
      Storage.mockImplementationOnce(() => ({
        getBuckets: jest.fn().mockRejectedValue(new Error('Storage error'))
      }));

      await expect(authenticateImplicitWithAdc()).rejects.toThrow('Storage error');
    });
  });
});
