"use client"

import {motion} from "motion/react"
import { useEffect,  useRef } from "react";
import {useMutation, useQuery} from "@tanstack/react-query";

const getPitchTypes = async () => {
        const res = await fetch("/api/pitch_types");
        return res.json()
    }


export default function PitchModalForm({onClose}) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const container = 
    { hidden: { 
        opacity: 0, height: "1px", scale: 0, 
        }, 
        show: {
            opacity: 1, x: 0, height: "auto", scale: 1, transition:
            { duration: 0.15, ease: "easeOut", }
            } }

        useEffect(() => {
            function handleClickOutside(e: MouseEvent) {
                if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                    onClose?.();
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [onClose]);

        const {data, isLoading, error} = useQuery({
            queryKey: ["pitchTypes"],
            queryFn: getPitchTypes
        })  
        
       
    
  return (
    <motion.div ref={modalRef} variants={container} initial="hidden" animate="show" className="relative w-[500px] h-auto p-6 rounded-none 
      bg-white/30 dark:bg-black/30 
      backdrop-blur-2xl 
      border border-black/10 dark:border-white/10 
      text-black dark:text-white">     

        <h1 className="text-2xl font-semibold mb-6">Create a Pitch</h1>

        <div className="flex flex-col mb-4">
            <label className="text-sm mb-1 opacity-80">Pitch Title</label>
            <input
            type="text"
            placeholder="Enter pitch title"
            className="px-4 py-3 rounded-none bg-white/20 dark:bg-white/5 
                border border-black/10 dark:border-white/10 
                backdrop-blur-md 
                focus:ring-2 focus:ring-white/30 outline-none"
            />
        </div>

        <div className="flex flex-col mb-4">
            <label className="text-sm mb-1 opacity-80">Pitch Type</label>
        <select
        className="
            px-4 py-2.5
            bg-white/10 dark:bg-white/5 
            border border-black/10 dark:border-white/10
            text-sm
            backdrop-blur-sm
            outline-none
            focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20
            transition
        "
        >
        {data.pitchTypes.map((pitchType:{name: string, id: string}) => (
            <option
            key={pitchType.id}
            className="
                bg-white dark:bg-neutral-900
                text-black dark:text-white
                py-2
            "
            >
            {pitchType.name}
            </option>
        ))}
        </select>


        </div>

        <div className="flex flex-col mb-4">
            <label className="text-sm mb-1 opacity-80">Description</label>
            <textarea
            placeholder="Write your pitch description..."
            rows={4}
            className="px-4 py-3 rounded-none bg-white/20 dark:bg-white/5
                border border-black/10 dark:border-white/10 
                backdrop-blur-md resize-none
                focus:ring-2 focus:ring-white/30 outline-none"
            />
        </div>

        <div className="flex flex-col mb-6">
            <label className="text-sm mb-1 opacity-80">Goal</label>
            <input
            type="text"
            placeholder="What is your goal?"
            className="px-4 py-3 rounded-none bg-white/20 dark:bg-white/5 
                border border-black/10 dark:border-white/10 
                backdrop-blur-md 
                focus:ring-2 focus:ring-white/30 outline-none"
            />
        </div>
        <div className="flex justify-between">
        <button
            className=" py-1 px-2 rounded-none  font-medium border-gray-400 border
            "
            onClick={onClose}
        >
            Cancel
        </button>
        <button
            className=" py-1 px-2 rounded-none 
            bg-[#f3fded]
            dark:from-white/20 dark:to-white/10 
            text-black dark:text-black"
        >
            Start
        </button>
        </div>
    </motion.div>
  );
}
