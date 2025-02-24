import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
    }

    // System Prompt: Tells the AI it is a meal plan generator
    const systemPrompt = `
    You are a **nutrition-focused meal plan generator**. Your job is to create **structured, personalized meal plans** based on user preferences, dietary restrictions, and transformation goals.
      
      **Meal Plan Structure (Use Markdown for Formatting):**  
      - **Each meal should be a heading** (e.g., "### Breakfast: Avocado Toast").  
      - **List ingredients as bullet points** (e.g., "- 1 slice whole grain bread").  
      - **Include a "Nutritional Info" section in bullet format**.  
      - **Provide clear preparation steps with line breaks**.  

      **Example Output (Format Strictly Like This):**  

      ### **Breakfast: Oatmeal with Berries**  
      **Ingredients:**  
      - ½ cup oats  
      - 1 cup almond milk  
      - 1 tbsp honey  
      - ¼ cup blueberries  

      **Nutritional Info:**  
      - **Calories:** 320 kcal  
      - **Protein:** 10g  
      - **Carbs:** 55g  
      - **Fats:** 5g  

      **Preparation:**  
      1. Cook oats in almond milk for 5 minutes.  
      2. Stir in honey and top with blueberries.  
      3. Serve warm and enjoy!  

      Ensure your response follows this exact format, using **headings, bullet points, and line breaks** for readability.  
  
      If the user request is **unrelated to food**, respond with: *"Sorry, I can only generate meal plans."*
    `
    ;
    // Combine system prompt with user input
    const fullPrompt = `${systemPrompt}\nUser Request: ${prompt}`;

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

    //here we can set the model we will use. 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    // Generate meal plan
    const response = await model.generateContent(fullPrompt);

    const text = response.response.text(); // Adjust based on actual API response format

    return new Response(JSON.stringify({ mealPlan: text }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
