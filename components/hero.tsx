'use client';

import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import robotAnimation from "@/app/robot.json";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Header() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-3 sm:py-6 w-full">
      {/* Left Section - Animated Text */}
      <div className="w-[90vw] sm:max-w-lg text-center lg:text-left lg:ml-0 z-10 mx-auto lg:mx-0"> 
        <motion.h1
          className="text-4xl sm:text-6xl lg:text-7xl font-bold"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          PrepSmart
        </motion.h1>

        <motion.p
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold mt-2 sm:mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Personalized Meal Planner
        </motion.p>

        <motion.p
          className="text-base sm:text-lg lg:text-xl italic text-muted-foreground mt-1 sm:mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Tailored just for you, by AI
        </motion.p>
      </div>

      {/* Right Section - Lottie Animation */}
      <div className="w-[90vw] sm:w-full h-[300px] sm:h-[450px] lg:h-[600px] lg:w-[600px] flex justify-center mx-auto lg:mx-0">
        <Lottie animationData={robotAnimation} loop={true} />
      </div>
    </div>
  );
}


