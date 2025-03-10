import Hero from "@/components/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GuestContinueButton from "@/components/GuestContinueButton";
import Image from "next/image";
import prepSmartLogo from "@/components/prepsmartlogos/PrepSmartLogoAllWhite.png";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex flex-col items-center justify-start px-4 space-y-6 mt-[-50px]">
        <div className="flex flex-col items-center space-y-2">
          <Image src={prepSmartLogo} alt="PrepSmart Logo" width={150} height={150} />
        </div>

        <h2 className="text-center text-primary font-semibold text-3xl">
          Get Started Now!
        </h2>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>

        <GuestContinueButton />
      </main>
    </>
  );
}
