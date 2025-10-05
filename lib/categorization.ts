import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const VALID_CATEGORIES = ['food', 'fashion', 'entertainment', 'transport', 'travel', 'living', 'other'] as const;
export type Category = typeof VALID_CATEGORIES[number];

/**
 * Categorize a purchase item using Gemini AI
 * @param itemName - Name of the item
 * @param description - Optional description of the item
 * @returns Category string
 */
export async function categorizePurchase(
  itemName: string, 
  description?: string
): Promise<Category> {
  try {
    const categories = "food, fashion, entertainment, transport, travel, living";
    const itemInfo = description ? `${itemName} (${description})` : itemName;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Categorize "${itemInfo}" into one of the following categories: ${categories}. If it doesn't fit any category, respond with "other". Reply with only one word - the category name.`,
    } as any);

    const aiCategory = (response.text || 'other').toLowerCase().replace(/\./g, "").trim();
    
    // Validate category
    if (VALID_CATEGORIES.includes(aiCategory as Category)) {
      return aiCategory as Category;
    }
    
    return 'other';
  } catch (error) {
    console.warn('AI categorization failed, using default category:', error);
    return 'other';
  }
}

/**
 * Batch categorize multiple items
 * @param items - Array of items to categorize
 * @returns Array of categories in the same order
 */
export async function categorizeBatch(
  items: Array<{ name: string; description?: string }>
): Promise<Category[]> {
  const promises = items.map(item => 
    categorizePurchase(item.name, item.description)
  );
  
  return Promise.all(promises);
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: Category): string {
  const displayNames: Record<Category, string> = {
    food: 'Food & Dining',
    fashion: 'Fashion & Apparel',
    entertainment: 'Entertainment',
    transport: 'Transportation',
    travel: 'Travel',
    living: 'Living & Household',
    other: 'Other'
  };
  
  return displayNames[category] || 'Other';
}

/**
 * Get category icon/emoji
 */
export function getCategoryIcon(category: Category): string {
  const icons: Record<Category, string> = {
    food: '🍔',
    fashion: '👕',
    entertainment: '🎮',
    transport: '🚗',
    travel: '✈️',
    living: '🏠',
    other: '📦'
  };
  
  return icons[category] || '📦';
}
