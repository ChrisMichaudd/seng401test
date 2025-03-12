'use client';  

import { motion } from "framer-motion";
import dynamic from 'next/dynamic';


const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import robotAnimation from "@/app/robot.json";  

export default function Header() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-6 mt-[-150px]">
      
      {/* Left Section - Animated Text */}
      <div className="max-w-lg text-left lg:ml-0"> 
        <motion.h1
          className="text-6xl lg:text-7xl font-bold"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          PrepSmart
        </motion.h1>

        <motion.p
          className="text-3xl lg:text-4xl font-semibold mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Personalized Meal Planner
        </motion.p>

        <motion.p
          className="text-lg lg:text-xl italic text-muted-foreground mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Tailored just for you, by AI
        </motion.p>
      </div>

      {/* Right Section - Lottie Animation */}
      <div className="w-full lg:w-[800px] h-[800px] flex justify-center">
        <Lottie animationData={robotAnimation} loop={true} />
      </div>
    </div>
  );
}


