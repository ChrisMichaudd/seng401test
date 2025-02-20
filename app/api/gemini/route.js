import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
    }

    // System Prompt: Tells the AI it is a meal plan generator
    const systemPrompt = `
    You are a meal plan generator. Your job is to create structured, personalized meal plans based on user preferences 
    and respect for dietary restrictions. Generate breakfast, lunch and dinner for one day. List what type of meal it is, 
    for example 'Breakfast: Cereal" and then have bullet points for what ingredients are in the meal. 

    If the user request is unrelated to food, or meal planning, simply generate "Sorry, your meal could not be generated."
    `;

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
