//import NextLogo from "./next-logo";
//import SupabaseLogo from "./supabase-logo";

export default function Header() {
  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Main Title */}
      <div className="flex justify-center items-center">
        <h1 className="text-6xl lg:text-7xl font-bold">PrepSmart</h1>
      </div>

      {/* Slogan */}
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Personalized Meal Plans, Powered by AI{" "}
      </p>

      {/* Divider */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
