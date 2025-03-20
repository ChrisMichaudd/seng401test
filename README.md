<div align="center">
  <img src="components/prepsmartlogos/PrepSmartLogoAllWhite.png" alt="PrepSmart Logo" width="200">
  <h1>PrepSmart - AI-Powered Meal Planning Made Simple</h1>
</div>

<p align="center">
  PrepSmart is an intelligent meal planning application that creates personalized weekly meal plans using AI technology, taking into account your dietary preferences, health goals, and budget.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#local-development"><strong>Local Development</strong></a>
</p>

## Features

- **Personalized Meal Plans**: Generate custom weekly meal plans based on:
  - Personal Information (age, gender, height, weight)
  - Activity Level
  - Dietary Preferences (vegetarian, vegan, keto, paleo, etc.)
  - Food Allergies and Restrictions
  - Transformation Goals (weight loss, maintenance, muscle gain)
  - Weekly Budget

- **Comprehensive Meal Details**:
  - Complete recipes with ingredients and instructions
  - Calorie and protein information
  - Cost estimates per meal
  - Weekly nutrition summaries

- **Smart Shopping**:
  - Categorized grocery lists
  - Quantity calculations
  - Price estimates
  - Exportable shopping lists

- **User-Friendly Interface**:
  - Modern, responsive design
  - Dark/light theme support
  - Easy meal plan sharing
  - Secure authentication

## Getting Started

1. Create an account or sign in
2. Fill in your personal details and preferences
3. Set your weekly budget and dietary restrictions
4. Generate your personalized meal plan
5. View, share, or export your plan and grocery list

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Authentication)
- **AI**: Google Gemini 1.5
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Local Development

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase and Google Gemini API keys

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```
