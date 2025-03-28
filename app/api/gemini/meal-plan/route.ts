import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const schema = {
  type: "object",
  properties: {
    weeklyMealPlan: {
      type: "object",
      properties: {
        breakfast: {
          type: "array",
          minItems: 7,
          maxItems: 7,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              ingredients: { type: "array", items: { type: "string" } },
              calories: { type: "number" },
              protein: { type: "number" },
              instructions: { type: "array", items: { type: "string" } },
              estimatedCost: { type: "number" }
            }
          }
        },
        lunch: {
          type: "array",
          minItems: 7,
          maxItems: 7,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              ingredients: { type: "array", items: { type: "string" } },
              calories: { type: "number" },
              protein: { type: "number" },
              instructions: { type: "array", items: { type: "string" } },
              estimatedCost: { type: "number" }
            }
          }
        },
        dinner: {
          type: "array",
          minItems: 7,
          maxItems: 7,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              ingredients: { type: "array", items: { type: "string" } },
              calories: { type: "number" },
              protein: { type: "number" },
              instructions: { type: "array", items: { type: "string" } },
              estimatedCost: { type: "number" }
            }
          }
        }
      }
    },
    groceryList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                quantity: { type: "string" },
                estimatedPrice: { type: "number" }
              }
            }
          }
        }
      }
    },
    totalWeeklyCost: { type: "number" },
    nutritionSummary: {
      type: "object",
      properties: {
        averageDailyCalories: { type: "number" },
        averageDailyProtein: { type: "number" }
      }
    }
  }
};

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const userData = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 1,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `Create a detailed weekly meal plan based on the following user information:
      - Age: ${userData.age}
      - Gender: ${userData.gender}
      - Height: ${userData.height}cm
      - Weight: ${userData.weight}kg
      - Activity Level: ${userData.activity_level}
      - Weekly Budget: $${userData.weekly_budget}
      - Transformation Goal: ${userData.transformation_goal}
      ${userData.vegetarian ? '- Dietary Preference: Vegetarian' : ''}
      ${userData.vegan ? '- Dietary Preference: Vegan' : ''}
      ${userData.pescatarian ? '- Dietary Preference: Pescatarian' : ''}
      ${userData.keto ? '- Dietary Preference: Keto' : ''}
      ${userData.paleo ? '- Dietary Preference: Paleo' : ''}
      ${userData.gluten_free ? '- Dietary Preference: Gluten Free' : ''}
      ${userData.custom_dietary_preferences ? `- Custom Dietary Preferences: ${userData.custom_dietary_preferences}` : ''}
      ${userData.allergy_nuts ? '- Allergy: Nuts' : ''}
      ${userData.allergy_dairy ? '- Allergy: Dairy' : ''}
      ${userData.allergy_gluten ? '- Allergy: Gluten' : ''}
      ${userData.allergy_shellfish ? '- Allergy: Shellfish' : ''}
      ${userData.allergy_soy ? '- Allergy: Soy' : ''}
      ${userData.allergy_eggs ? '- Allergy: Eggs' : ''}
      ${userData.custom_allergies ? `- Custom Allergies: ${userData.custom_allergies}` : ''}

      IMPORTANT: Return a JSON object with this exact structure. No other text or formatting:
      {
        "weeklyMealPlan": {
          "breakfast": [/* 7 meals */],
          "lunch": [/* 7 meals */],
          "dinner": [/* 7 meals */]
        },
        "groceryList": [{
          "category": "string",
          "items": [{
            "name": "string",
            "quantity": "string",
            "estimatedPrice": number
          }]
        }],
        "totalWeeklyCost": number,
        "nutritionSummary": {
          "averageDailyCalories": number,
          "averageDailyProtein": number
        }
      }

      Each meal must have:
      {
        "name": "string",
        "ingredients": ["string"],
        "calories": number,
        "protein": number,
        "instructions": ["string"],
        "estimatedCost": number
      }

      Requirements (STRICT MUST ADHERE TO ALL):
      - 7 meals per category
      - Stay within budget: $${userData.weekly_budget}
      - Match dietary restrictions
      - Support ${userData.transformation_goal}
      - Include nutrition info
      - List all groceries needed`;

    const response = await model.generateContent(prompt);
    const responseText = response.response.text();
    
    try {
      // First try to parse the raw response
      let jsonString = responseText;
      
      // If that fails, try to extract from markdown
      if (responseText.includes('```')) {
        const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
        jsonString = jsonMatch ? jsonMatch[1].trim() : responseText;
      }

      const parsedResponse = JSON.parse(jsonString);
      return new Response(JSON.stringify({ mealPlan: parsedResponse }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return new Response(JSON.stringify({ error: 'Failed to parse meal plan response' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate meal plan' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
} 