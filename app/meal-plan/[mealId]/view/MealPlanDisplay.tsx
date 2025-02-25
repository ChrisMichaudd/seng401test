"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Share2, Download } from 'lucide-react';
import type { MealPlanData, MealType } from './types';

export default function MealPlanDisplay({ mealPlan }: { mealPlan: MealPlanData }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My PrepSmart Meal Plan',
          text: 'Check out my personalized meal plan!',
          url: window.location.href
        });
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleExportGroceryList = () => {
    const groceryText = mealPlan.groceryList.map(category => {
      return `\n${category.category.toUpperCase()}\n${category.items
        .map(item => `${item.name} (${item.quantity}) - $${item.estimatedPrice.toFixed(2)}`)
        .join('\n')}`;
    }).join('\n');

    const total = mealPlan.groceryList.reduce((sum, category) => 
      sum + category.items.reduce((catSum, item) => catSum + item.estimatedPrice, 0), 0
    );

    const fullText = `GROCERY LIST\n${groceryText}\n\nTotal: $${total.toFixed(2)}`;

    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocery-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Calculate grocery list total
  const groceryTotal = mealPlan.groceryList.reduce((sum, category) => 
    sum + category.items.reduce((catSum, item) => catSum + item.estimatedPrice, 0), 0
  );

  // Ensure all meal types exist with default empty arrays
  const weeklyMealPlan = {
    breakfast: mealPlan.weeklyMealPlan?.breakfast || [],
    lunch: mealPlan.weeklyMealPlan?.lunch || [],
    dinner: mealPlan.weeklyMealPlan?.dinner || [],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Personalized Meal Plan</h1>
        <button
          onClick={handleShare}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Share meal plan"
        >
          <Share2 className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-black">Weekly Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Weekly Cost</p>
            <p className="text-2xl font-bold text-green-600">
              ${mealPlan.totalWeeklyCost?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Daily Calories</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(mealPlan.nutritionSummary?.averageDailyCalories || 0)} kcal
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Daily Protein</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(mealPlan.nutritionSummary?.averageDailyProtein || 0)}g
            </p>
          </div>
        </div>
      </div>

      {/* Meal Categories */}
      {Object.entries(weeklyMealPlan).map(([mealType, meals]) => 
        meals && meals.length > 0 ? (
          <div key={mealType} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{mealType} Options</h2>
            <div className="grid grid-cols-1 gap-4">
              {meals.map((meal: MealType, index: number) => (
                <MealCard key={index} meal={meal} dayNumber={index + 1} />
              ))}
            </div>
          </div>
        ) : null
      )}

      {/* Updated Grocery List */}
      {mealPlan.groceryList && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-black">Grocery List</h2>
            <button
              onClick={handleExportGroceryList}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Download size={16} />
              Export List
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Produce Section */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-black">Produce</h3>
              <div className="space-y-2">
                {mealPlan.groceryList
                  .find(cat => cat.category.toLowerCase() === 'produce')
                  ?.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-black">{item.name}</span>
                        <span className="text-gray-600 text-sm ml-2">({item.quantity})</span>
                      </div>
                      <span className="text-green-600 font-medium">${item.estimatedPrice.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pantry Section */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-black">Pantry</h3>
              <div className="space-y-2">
                {mealPlan.groceryList
                  .find(cat => cat.category.toLowerCase() === 'pantry')
                  ?.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-black">{item.name}</span>
                        <span className="text-gray-600 text-sm ml-2">({item.quantity})</span>
                      </div>
                      <span className="text-green-600 font-medium">${item.estimatedPrice.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Grocery Total */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end items-center">
              <span className="text-lg font-medium text-black mr-2">Total:</span>
              <span className="text-xl font-bold text-green-600">${groceryTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MealCard({ meal, dayNumber }: { meal: MealType; dayNumber: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Main card content - always visible */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer relative"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Day {dayNumber}</span>
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              {meal.name}
              <Info 
                size={16} 
                className={`text-gray-400 transition-opacity ${
                  isHovered ? 'opacity-100' : 'opacity-50'
                }`}
              />
            </h3>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{meal.calories} kcal</span>
            <span>{meal.protein}g protein</span>
            <span className="text-green-600 font-medium">
              ${meal.estimatedCost.toFixed(2)}
            </span>
          </div>
        </div>
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isExpanded ? "Hide details" : "Show details"}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Tooltip */}
        {isHovered && !isExpanded && (
          <div className="absolute top-0 right-12 mt-3 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg">
            Click for details
          </div>
        )}
      </div>

      {/* Expandable details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {meal.ingredients?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Ingredients</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                {meal.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {meal.instructions?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Instructions</h4>
              <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1">
                {meal.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 