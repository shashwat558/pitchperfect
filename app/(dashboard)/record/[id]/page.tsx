"use client";

import { motion } from "framer-motion";

export default function Record() {
  return (
    <div className="relative h-screen w-screen bg-background text-foreground flex items-center justify-center overflow-hidden">


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none dark:opacity-[0.05]"
        style={{
          backgroundImage: PATTERNS.dots,
        }}
      />

 
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-[90%] h-[80%] rounded-xl border border-foreground/10 dark:border-foreground/20 
                   bg-white/40 dark:bg-black/20 backdrop-blur-md shadow-lg p-6 flex flex-col"
      >

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="flex justify-between items-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold"
          >
            Record the next big thing!!
          </motion.h1>

          <motion.h2
            variants={fadeUp}
            className="text-lg md:text-xl"
          >
            Pitch Type:{" "}
            <span className="px-2 py-1 rounded bg-foreground/10 dark:bg-foreground/20">
              YC
            </span>
          </motion.h2>
        </motion.div>

      </motion.div>
    </div>
  );
}



const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};



const PATTERNS = {

  diagonalElegant:
    "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 14px)",


  verticalSoft:
    "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 18px)",


  gridMinimal:
    "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",


  dots:
    "radial-gradient(currentColor 1px, transparent 1px)",

  wave:
    "repeating-linear-gradient(120deg, currentColor 0 2px, transparent 2px 18px)",
};
