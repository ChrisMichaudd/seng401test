//import NextLogo from "./next-logo";
//import SupabaseLogo from "./supabase-logo";

export default function Header() {
  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Main Title */}
      <div className="flex justify-center items-center">
        <h1 className="text-6xl lg:text-7xl font-bold">PrepSmart</h1>
      </div>

      {/* Slogan - Different font sizes for hierarchy */}
      <div className="flex flex-col items-center text-center mx-auto max-w-xl">
        <p className="text-3xl lg:text-4xl font-semibold">Personalized Meal Planner</p>
        <p className="text-lg lg:text-xl italic text-muted-foreground">Tailored just for you, by AI</p>
      </div>

      {/* Divider */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}


