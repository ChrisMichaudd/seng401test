"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { TrendingDown, MinusCircle, Loader2, ChefHat } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the shape of our "meal_plans" row
interface MealPlanData {
  meal_id: string;
  user_email: string | null;
  name: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  activity_level: string | null;
  vegetarian: boolean;
  vegan: boolean;
  pescatarian: boolean;
  keto: boolean;
  paleo: boolean;
  gluten_free: boolean;
  custom_dietary_preferences: string | null;
  allergy_nuts: boolean;
  allergy_dairy: boolean;
  allergy_gluten: boolean;
  allergy_shellfish: boolean;
  allergy_soy: boolean;
  allergy_eggs: boolean;
  custom_allergies: string | null;
  transformation_goal: string | null;
  weekly_budget: number | null;
  // ...other columns as needed
}

interface MealPlanFormClientProps {
  mealId: string;
  initialData: MealPlanData;
}

export default function MealPlanFormClient({ mealId, initialData }: MealPlanFormClientProps) {
  const supabase = createClient();
  const router = useRouter();

  // Local state for the form
  const [formData, setFormData] = useState<MealPlanData>({
    ...initialData,
  });

  // We'll store an optional status message
  const [statusMessage, setStatusMessage] = useState("");

  // Initialize units based on data
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    initialData.weight && initialData.weight > 200 ? 'lbs' : 'kg'
  );
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(
    initialData.height && initialData.height < 300 ? 'ft' : 'cm'
  );
  const [heightFeet, setHeightFeet] = useState<string>(
    initialData.height && heightUnit === 'ft' 
      ? Math.floor(initialData.height / 30.48).toString()
      : ''
  );
  const [heightInches, setHeightInches] = useState<string>(
    initialData.height && heightUnit === 'ft'
      ? (Math.round((initialData.height % 30.48) / 2.54)).toString()
      : ''
  );

  // Add these helper functions
  const convertLbsToKg = (lbs: number): number => {
    return lbs * 0.45359237;
  };

  const convertFtInchesToCm = (feet: number, inches: number): number => {
    const totalInches = (feet * 12) + inches;
    return totalInches * 2.54;
  };

  // A helper to handle changes for text/number/select/checkbox inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    let value = target.type === 'checkbox' ? (target as HTMLInputElement).checked.toString() : target.value;
    const name = target.name;
  
    // Allow empty values (lets users backspace everything)
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }
  
    // GENDER VALIDATION (Allow only letters and spaces)
    if (name === "gender") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setStatusMessage("Invalid input for gender. Please enter only letters.");
        return;
      }
    }
  
    // WEIGHT, HEIGHT, AND AGE VALIDATION (Allow only valid numbers)
    if (["weight", "height", "age"].includes(name)) {
      if (!/^\d*\.?\d*$/.test(value)) {
        setStatusMessage(`Invalid ${name}. Please enter a valid number.`);
        return;
      }
    }
  
    // If it's a checkbox, update state as boolean
    if (target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (target as HTMLInputElement).checked, 
      }));
    } 
    // If it's a number input, parse it into a float (or int)
    else if (target.type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: target.value === "" ? null : parseFloat(target.value), 
      }));
    } 
    // Otherwise, update as normal text/select/textarea
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // Submit handler: updates the row in Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
  
    if (!validateFormData()) return;
  
    let weightInKg = formData.weight;
    if (weightUnit === "lbs" && weightInKg) {
      weightInKg = convertLbsToKg(weightInKg);
    }
  
    let heightInCm = formData.height;
    if (heightUnit === "ft" && heightFeet && heightInches) {
      heightInCm = convertFtInchesToCm(parseFloat(heightFeet), parseFloat(heightInches));
    }
  
    const { data, error } = await supabase
      .from("meal_plans")
      .update({
        ...formData,
        weight: weightInKg,
        height: heightInCm,
      })
      .eq("meal_id", mealId)
      .single();
  
    if (error) {
      console.error("Update error:", error);
      setStatusMessage("There was an error updating your meal plan. Please try again.");
    } else {
      setStatusMessage("Meal plan updated successfully!");
    }
  };
  

  // Add this validation function near your other helper functions
  const validateRequiredFields = (): { isValid: boolean; firstMissingField: string | null } => {
    const requiredFields = [
      { name: 'name', label: 'Name' },
      { name: 'age', label: 'Age' },
      { name: 'gender', label: 'Gender' },
      { name: 'height', label: 'Height' },
      { name: 'weight', label: 'Weight' },
      { name: 'activity_level', label: 'Activity Level' },
      { name: 'transformation_goal', label: 'Transformation Goal' },
      { name: 'weekly_budget', label: 'Weekly Budget' },
    ];

    for (const field of requiredFields) {
      if (!formData[field.name as keyof typeof formData]) {
        return { isValid: false, firstMissingField: field.name };
      }
    }

    return { isValid: true, firstMissingField: null };
  };

  // Add loading state
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    if (!validateFormData()){
      setStatusMessage("Please fix the errors before generating a meal plan");
      return;
    } 

    // First, save current form data
    const weightInKg = weightUnit === 'lbs' && formData.weight 
      ? convertLbsToKg(formData.weight)
      : formData.weight;

    const heightInCm = heightUnit === 'ft' && heightFeet && heightInches
      ? convertFtInchesToCm(parseFloat(heightFeet), parseFloat(heightInches))
      : formData.height;

    // Save to database first
    const { error: saveError } = await supabase
      .from("meal_plans")
      .update({
        ...formData,
        weight: weightInKg,
        height: heightInCm,
      })
      .eq("meal_id", mealId)
      .single();

    if (saveError) {
      console.error("Save error:", saveError);
      setStatusMessage("Failed to save your data. Please try again.");
      return;
    }

    // Validate required fields
    const { isValid, firstMissingField } = validateRequiredFields();
    
    if (!isValid && firstMissingField) {
      const element = document.getElementById(firstMissingField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      
      setStatusMessage(`Please fill in your ${firstMissingField.replace('_', ' ')} before generating a plan.`);
      return;
    }

    // If valid, call Gemini API
    try {
      setIsGenerating(true);
      setStatusMessage("Generating your meal plan...");
      
      const response = await fetch('/api/gemini/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weight: weightInKg,
          height: heightInCm,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate meal plan');
      
      const { mealPlan } = await response.json();
      
      // Save the AI response to the database
      const { error: updateError } = await supabase
        .from("meal_plans")
        .update({ ai_return: mealPlan })
        .eq("meal_id", mealId)
        .single();

      if (updateError) {
        console.error("Error saving AI response:", updateError);
        setStatusMessage("Generated plan but failed to save. Please try again.");
        return;
      }

      // Redirect to the view page
      router.push(`/meal-plan/${mealId}/view`);
      
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage("Failed to generate meal plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };


  // Update these height handlers
  const handleHeightFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightFeet(e.target.value);
    // Update formData.height when feet changes
    if (e.target.value && heightInches) {
      const heightInCm = convertFtInchesToCm(
        parseFloat(e.target.value),
        parseFloat(heightInches)
      );
      setFormData(prev => ({ ...prev, height: heightInCm }));
    }
  };

  const handleHeightInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightInches(e.target.value);
    // Update formData.height when inches changes
    if (heightFeet && e.target.value) {
      const heightInCm = convertFtInchesToCm(
        parseFloat(heightFeet),
        parseFloat(e.target.value)
      );
      setFormData(prev => ({ ...prev, height: heightInCm }));
    }
  };

  // Validates the values of age, weight, and height ensuring they are in a reasonable range
  const validateFormData = (): boolean => {
    let invalidFields: string[] = [];
  
    if (formData.age !== null && (formData.age < 10 || formData.age > 120)) {
      invalidFields.push("age");
    }
  
    if (formData.weight !== null && (formData.weight < 20 || formData.weight > 900)) {
      invalidFields.push("weight");
    }
  
    if (heightUnit === "cm") {
      if (formData.height !== null && (formData.height < 50 || formData.height > 250)) {
        invalidFields.push("height (cm)");
      }
    } else if (heightUnit === "ft") {
      const feet = parseFloat(heightFeet);
      const inches = parseFloat(heightInches);
  
      if (isNaN(feet) || feet < 2 || feet > 8) {
        invalidFields.push("height (feet)");
      }
  
      if (isNaN(inches) || inches < 0 || inches >= 12) {
        invalidFields.push("height (inches)");
      }
    }
  
    if (invalidFields.length > 0) {
      let formattedFields = invalidFields.join(", ");
  
      if (invalidFields.length > 1) {
        const lastField = invalidFields.pop();
        formattedFields = `${invalidFields.join(", ")} and ${lastField}`;
      }
  
      setStatusMessage(`Invalid ${formattedFields}. Please enter realistic values.`);
      return false;
    }
  
    return true;
  };
  

  
  // Update the height unit handler
  const handleHeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as 'cm' | 'ft';
    setHeightUnit(newUnit);
    
    if (newUnit === 'cm') {
      // Convert ft/in to cm if values exist
      if (heightFeet && heightInches) {
        const heightInCm = convertFtInchesToCm(
          parseFloat(heightFeet),
          parseFloat(heightInches)
        );
        setFormData(prev => ({ ...prev, height: heightInCm }));
      }
    } else {
      // Convert cm to ft/in if height exists
      if (formData.height) {
        const totalInches = formData.height / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        setHeightFeet(feet.toString());
        setHeightInches(inches.toString());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      {/* NAME - New field */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name ?? ""}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg p-2 w-full bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
          placeholder="Enter your name"
        />
      </div>

      {/* AGE - Disable scroll */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="age">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          value={formData.age ?? ""}
          onChange={handleChange}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          className="border border-gray-200 rounded-lg p-2 w-full bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
          placeholder="e.g. 30"
        />
      </div>

      {/* GENDER - Changed to text input */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="gender">
          Gender
        </label>
        <input
          id="gender"
          name="gender"
          type="text"
          value={formData.gender ?? ""}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg p-2 w-full bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
          placeholder="Enter your gender"
        />
      </div>

      {/* WEIGHT with unit selection */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="weight">
            Weight
          </label>
          <div className="flex gap-2">
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              value={formData.weight ?? ""}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg p-2 flex-1 bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
              placeholder="Enter weight"
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
              className="border border-gray-200 rounded-lg p-2 w-24 bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
      </div>

      {/* HEIGHT with unit selection */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Height
        </label>
        <div className="flex gap-2 items-end">
          {heightUnit === 'cm' ? (
            <>
              <input
                name="height"
                type="number"
                step="0.1"
                value={formData.height ?? ""}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg p-2 flex-1 bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
                placeholder="Enter height"
              />
              <select
                value={heightUnit}
                onChange={handleHeightUnitChange}
                className="border border-gray-200 rounded-lg p-2 w-24 bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
              >
                <option value="cm">cm</option>
                <option value="ft">ft/in</option>
              </select>
            </>
          ) : (
            <>
              <div className="flex-1 flex gap-2">
                <div>
                  <label className="text-xs text-gray-600">Feet</label>
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={handleHeightFeetChange}
                    className="border border-gray-200 rounded-lg p-2 w-full bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
                    placeholder="ft"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Inches</label>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={handleHeightInchesChange}
                    className="border border-gray-200 rounded-lg p-2 w-full bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
                    placeholder="in"
                  />
                </div>
              </div>
              <select
                value={heightUnit}
                onChange={handleHeightUnitChange}
                className="border border-gray-200 rounded-lg p-2 w-24 bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
              >
                <option value="cm">cm</option>
                <option value="ft">ft/in</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* ACTIVITY LEVEL */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Activity Level
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-2">
          {[
            { value: 'sedentary', icon: AirlineSeatReclineNormalIcon, label: 'Sedentary' },
            { value: 'light', icon: DirectionsWalkIcon, label: 'Light' },
            { value: 'moderate', icon: NordicWalkingIcon, label: 'Moderate' },
            { value: 'high', icon: DirectionsRunIcon, label: 'High' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
                ${formData.activity_level === option.value 
                  ? 'bg-green-50 border-2 border-green-400' 
                  : 'bg-gray-100/50 border-2 border-gray-100 hover:border-green-200'}`}
            >
              <input
                type="radio"
                name="activity_level"
                value={option.value}
                checked={formData.activity_level === option.value}
                onChange={handleChange}
                className="sr-only"
              />
              <option.icon 
                className={`w-8 h-8 mb-2 ${
                  formData.activity_level === option.value 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`} 
              />
              <span className="text-sm text-center font-medium text-black">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* DIETARY PREFERENCES (checkboxes) */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Dietary Preferences
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-2">
          {[
            { name: 'vegetarian', label: 'Vegetarian' },
            { name: 'vegan', label: 'Vegan' },
            { name: 'pescatarian', label: 'Pescatarian' },
            { name: 'keto', label: 'Keto' },
            { name: 'paleo', label: 'Paleo' },
            { name: 'gluten_free', label: 'Gluten Free' }
          ].map((diet) => (
            <label
              key={diet.name}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
                ${formData[diet.name as keyof typeof formData]
                  ? 'bg-green-50 border-2 border-green-400' 
                  : 'bg-gray-100/50 border-2 border-gray-100 hover:border-green-200'}`}
            >
              <input
                type="checkbox"
                name={diet.name}
                checked={formData[diet.name as keyof typeof formData] as boolean}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-base text-center font-medium text-black">
                {diet.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom dietary preferences */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="custom_dietary_preferences">
          Custom Dietary Preferences
        </label>
        <textarea
          id="custom_dietary_preferences"
          name="custom_dietary_preferences"
          value={formData.custom_dietary_preferences ?? ""}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg p-2 w-full bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
          placeholder="Describe any other dietary preferences..."
        />
      </div>

      {/* ALLERGIES (checkboxes) */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Allergies
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-2">
          {[
            { name: 'allergy_nuts', label: 'Nuts' },
            { name: 'allergy_dairy', label: 'Dairy' },
            { name: 'allergy_gluten', label: 'Gluten' },
            { name: 'allergy_shellfish', label: 'Shellfish' },
            { name: 'allergy_soy', label: 'Soy' },
            { name: 'allergy_eggs', label: 'Eggs' }
          ].map((allergy) => (
            <label
              key={allergy.name}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
                ${formData[allergy.name as keyof typeof formData]
                  ? 'bg-green-50 border-2 border-green-400' 
                  : 'bg-gray-100/50 border-2 border-gray-100 hover:border-green-200'}`}
            >
              <input
                type="checkbox"
                name={allergy.name}
                checked={formData[allergy.name as keyof typeof formData] as boolean}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-base text-center font-medium text-black">
                {allergy.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom allergies */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="custom_allergies">
          Custom Allergies
        </label>
        <textarea
          id="custom_allergies"
          name="custom_allergies"
          value={formData.custom_allergies ?? ""}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg p-2 w-full bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
          placeholder="Describe any other allergies..."
        />
      </div>

      {/* TRANSFORMATION GOAL */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Transformation Goal
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-2">
          {[
            { value: 'lose_weight', icon: TrendingDown, label: 'Lose Weight' },
            { value: 'maintain_weight', icon: MinusCircle, label: 'Maintain' },
            { value: 'gain_muscle', icon: FitnessCenterIcon, label: 'Gain Muscle' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
                ${formData.transformation_goal === option.value 
                  ? 'bg-green-50 border-2 border-green-400' 
                  : 'bg-gray-100/50 border-2 border-gray-100 hover:border-green-200'}`}
            >
              <input
                type="radio"
                name="transformation_goal"
                value={option.value}
                checked={formData.transformation_goal === option.value}
                onChange={handleChange}
                className="sr-only"
              />
              <option.icon 
                className={`w-8 h-8 mb-2 ${
                  formData.transformation_goal === option.value 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`} 
              />
              <span className="text-sm text-center font-medium text-black">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* BUDGET */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600" htmlFor="weekly_budget">
          Weekly Budget
        </label>
        <input
          id="weekly_budget"
          name="weekly_budget"
          type="number"
          step="0.01"
          value={formData.weekly_budget ?? ""}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg p-2 w-full bg-gray-100/50 focus:bg-gray-100 focus:border-green-500 outline-none transition-colors placeholder-gray-500 text-black"
          placeholder="e.g. 100.00"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between items-center mt-8">
        <Button 
          type="button" 
          onClick={handleGeneratePlan}
          variant="default" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
        >
          Generate Plan
        </Button>

        <Button 
          type="submit" 
          variant="default" 
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg"
        >
          Save Changes
        </Button>
      </div>

      {/* Update the status message styling to handle errors */}
      {statusMessage && (
        <div className={`mt-4 text-center p-3 rounded-lg border ${
          statusMessage.includes('Please fill in') 
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          <div className="flex items-center justify-center gap-2">
            {isGenerating ? (
              <>
                <ChefHat className="w-5 h-5 animate-bounce" />
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Cooking up your personalized meal plan...</span>
              </>
            ) : (
              <span>{statusMessage}</span>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
