import 'dotenv/config';
import { Storage } from '@google-cloud/storage';
import { GoogleGenAI } from "@google/genai";

const projectId = 'gen-lang-client-0794843274';

export async function authenticateImplicitWithAdc() {
  const storage = new Storage({
    projectId,
  });
  const [buckets] = await storage.getBuckets();
  console.log('Buckets:');

  for (const bucket of buckets) {
    console.log(`- ${bucket.name}`);
  }

  console.log('Listed all storage buckets.');
}

// Make sure to set GEMINI_API_KEY in your environment or pass it directly
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// In cart
export async function roast(items: Record<string, string>, amount: string, goals: Record<string, [string, string]>) {
  const action = "if it is responsible or within budget, please say approved. if it is irresponsible, please roast me and stop me from buying it in 5 lines.";
  const list_of_items: string[] = [];
  const list_of_goals: string[] = [];
  
  for (const key in items) {
    list_of_items.push(`${key} for ${items[key]}`);
  }

  for (const key in goals) {
    list_of_goals.push(`${goals[key][0]} for ${key} by ${goals[key][1]}`);
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `I am buying ${list_of_items}. I have a budget of ${amount} left. and I have these goals: ${list_of_goals}. ${action} `,
  } as any);
  
  return response.text || '';
}

// For placing order
export async function categorize(items: Record<string, string>) {
  const categories = "food, fashion, entertainment, transport, travel or living";
  const cost_for_each_category: Record<string, Array<{ item: string; price: string }>> = {};
  
  for (const key in items) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Categorize ${key} into one of the following categories: ${categories}. reply in one word. `,
    } as any);

    const category = (response.text || '').toLowerCase().replace(/\./g, "").trim();
    if (!cost_for_each_category[category]) {
      cost_for_each_category[category] = [];
    }
    cost_for_each_category[category].push({ item: key, price: items[key] });
  }
  
  return cost_for_each_category;
}
