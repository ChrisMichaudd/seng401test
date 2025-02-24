"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client"; // Ensure this works on the client side
import ReactMarkdown from "react-markdown";

export default function MealPlanPage() {
  const [prompt, setPrompt] = useState("");
  const [mealPlan, setMealPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setMealPlan("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setMealPlan(data.mealPlan || "No response received.");
    } catch (error) {
      setMealPlan("Error generating meal plan. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8 px-4">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome</h1>
        <p className="text-muted-foreground">
          Let's create your personalized meal plan
        </p>
      </div>

      {/* User Input for Meal Preferences */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Your Preferences</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter dietary preferences, number of meals, etc."
          className="w-full p-2 border rounded"
        />
        <Button onClick={handleGenerate} className="mt-2" disabled={loading}>
          {loading ? "Generating..." : "Generate Meal Plan"}
        </Button>
      </div>

      {/* Display the Generated Meal Plan */}
      {mealPlan && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
        <h2 className="font-semibold">Meal Plan:</h2>
        <ReactMarkdown>{mealPlan}</ReactMarkdown>
      </div>
      )}
    </div>
  );
}