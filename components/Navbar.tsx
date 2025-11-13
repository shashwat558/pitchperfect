"use client"

import { Inconsolata } from 'next/font/google'
import Image from 'next/image'
import React, { useState } from 'react'
import {motion} from "motion/react";

import { BorderBeam } from './ui/BorderBeam';
import ThemeToggle from './theme-toggler';

const font = Inconsolata({
    weight: "400",
    subsets: ['latin']
})


const Navbar = ({className}: {className:string}) => {
    const [isHovered, setIsHovered] = useState(false);
    const mainContainer = {
    hidden: { opacity: 0, height: "1px" },
    show: {
        opacity: 1,
        height: "auto",
        transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
        },
    },
    }
    const container = {
        hidden: {
            opacity: 0
        },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            },
        },
    }
    const item = {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: { duration: 0 } }
    }
  return (
    <div className={`${className} ${font.className} w-screen py-3 px-5`}>
        <div className='flex justify-between items-center px-10'>
            <div className='px-2 flex gap-2'>
                <Image src={"/vercel.svg"} alt='logo' width={15} height={16}/>
                <h1 className='text-lg font-semibold'>PitchPerfect</h1>

            </div>
            <div className='relative flex justify-center space-x-12 items-center dark:text-[#f0ffe8]'>
                <h1>Features</h1>
                <div
                    className="relative"
                    
                    onMouseLeave={() => setIsHovered(false)}
                    >
                    <h1 className='flex items-center gap-1' onMouseEnter={() => setIsHovered(true)}>Pricing <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon-sm text-token-text-tertiary"><path d="M12.1338 5.94433C12.3919 5.77382 12.7434 5.80202 12.9707 6.02929C13.1979 6.25656 13.2261 6.60807 13.0556 6.8662L12.9707 6.9707L8.47067 11.4707C8.21097 11.7304 7.78896 11.7304 7.52926 11.4707L3.02926 6.9707L2.9443 6.8662C2.77379 6.60807 2.80199 6.25656 3.02926 6.02929C3.25653 5.80202 3.60804 5.77382 3.86617 5.94433L3.97067 6.02929L7.99996 10.0586L12.0293 6.02929L12.1338 5.94433Z"></path></svg></h1>
                     
                    <motion.div
                        variants={mainContainer}
                        initial="hidden"
                        animate={isHovered ? "show" : "hidden"}
                        className={`absolute top-5 -left-10 rounded-none  p-2 min-w-[450px]`}
                    >
                       <motion.ul
                        variants={container}
                        initial="hidden"
                        animate={isHovered ? "show" : "hidden"}
                        className="grid grid-cols-2 gap-2 mt-4 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-3 min-w-[320px]"
                        >
                        {[
                            { name: "Basic", desc: "For individuals starting out" },
                            { name: "Pro", desc: "For small teams scaling fast" },
                            { name: "Ultra Pro", desc: "For enterprises & heavy users" },
                            { name: "Custom", desc: "Tailored solutions on request" },
                        ].map((plan) => (
                            <motion.li
                            key={plan.name}
                            variants={item}
                            className={`group relative flex flex-col justify-center rounded-md border border-white/5 bg-white/5 px-4 py-3 hover:border-white/20 hover:bg-white/10 transition-all duration-200 cursor-pointer`}
                            >
                         
                            <h3 className="text-white text-sm font-medium group-hover:text-white">
                                {plan.name}
                            </h3>
                            <p className="text-gray-400 text-xs">{plan.desc}</p>
                            {plan.name === "Pro" && (
                                <BorderBeam
                                size={40}
                                duration={20}
                                colorFrom="#92ff6c"
                                colorTo="#a0ffea"
                                borderWidth={1.5}
                                className="rounded-md"
                                />
                            )}
                            </motion.li>
                        ))}
                        </motion.ul>

                    </motion.div>
                    </div>

                <h1>About</h1>
                <h1>Examples</h1>

                <div className='flex items-center gap-2'>
                    <button className='px-2 font-semibold dark:bg-[#183b05] rounded-sm' >Sign In</button>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar