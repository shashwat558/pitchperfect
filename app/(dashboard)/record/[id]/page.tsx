"use client";

import { Recorder } from "@/components/Recorder";
import { useQuery } from "@tanstack/react-query";
// import { createAuthClien } from "better-auth/client";
import { motion } from "framer-motion";
import { use } from "react";

interface PitchDetailsType {
  title: string,
  description: string,
  pitch_type: {
    name: string,
    duration: number,
    system_prompt: string,
    template_script: string
  }
}

const getPithcDetails = async(id: string) => {
  const res = await fetch(`/api/pitch/${id}`);
  if(res.ok){
    const data = await res.json();
    return data;
  }
}

export default function Record({params}: {params: Promise<{id: string}>}) {  
  const {id} = use(params);
 
 
  
  const {data, isPending, error} = useQuery({
    queryKey: ["pitchDetails"],
    queryFn:() => getPithcDetails(id)
  })

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error loading pitch</div>;
  }

  
  const pitchDetails: PitchDetailsType = {
    title: data.pitch.title,
    description: data.pitch.description,
    pitch_type: {
      name: data.pitch.pitch_type.name,
      duration: data.pitch.pitch_type.duration,
      system_prompt: data.pitch.pitch_type.system_prompt,
      template_script:data.pitch.pitch_type.template_script,
    }
  }

  console.log(id)
  return (
    <div className="relative h-screen w-screen bg-background text-foreground flex items-center justify-center overflow-hidden">


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none dark:opacity-[0.05]"
        style={{
          backgroundImage: PATTERNS.diagonalElegant,
        }}
      />

 
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative w-[90%] h-[85%] rounded-none border border-foreground/10 dark:border-foreground/20
          bg-white/40 dark:bg-black/20 backdrop-blur-md shadow-lg p-6 flex flex-col
          
        "
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
        <div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold"
          >
            {pitchDetails.title}
          </motion.h1>
          <motion.h3 className="dark:text-gray-400 text-gray-500">
            {pitchDetails.description}
          </motion.h3>
        </div>  

          <motion.h2
            variants={fadeUp}
            className="text-lg md:text-xl"
          >
            Pitch Type:{" "}
            <span className="px-2 py-1 rounded bg-foreground/10 dark:bg-foreground/20">
              {pitchDetails.pitch_type.name}
            </span>
          </motion.h2>
        </motion.div>
        
        <Recorder duration={pitchDetails.pitch_type.duration} pitchId={id} />
        
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
