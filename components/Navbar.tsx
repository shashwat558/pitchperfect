"use client"

import { Inconsolata } from 'next/font/google'
import Image from 'next/image'
import React, { useState } from 'react'
import {motion} from "motion/react";

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
            <div className='relative flex justify-center space-x-15 items-center'>
                <h1>Features</h1>
                <div
                    className="relative"
                    
                    onMouseLeave={() => setIsHovered(false)}
                    >
                    <h1 className='flex items-center gap-1' onMouseEnter={() => setIsHovered(true)}>Pricing <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon-sm text-token-text-tertiary"><path d="M12.1338 5.94433C12.3919 5.77382 12.7434 5.80202 12.9707 6.02929C13.1979 6.25656 13.2261 6.60807 13.0556 6.8662L12.9707 6.9707L8.47067 11.4707C8.21097 11.7304 7.78896 11.7304 7.52926 11.4707L3.02926 6.9707L2.9443 6.8662C2.77379 6.60807 2.80199 6.25656 3.02926 6.02929C3.25653 5.80202 3.60804 5.77382 3.86617 5.94433L3.97067 6.02929L7.99996 10.0586L12.0293 6.02929L12.1338 5.94433Z"></path></svg></h1>

                    <motion.div
                        variants={mainContainer}
                        initial="hidden"
                        animate={isHovered ? "show" : "hidden"}
                        className={`absolute top-10 left-0 rounded-none border border-white/10 bg-black/70 backdrop-blur-md shadow-lg p-2 min-w-[200px]`}
                    >
                        <motion.ul
                        variants={container}
                        initial="hidden"
                        animate={isHovered ? "show" : "hidden"}
                        className="flex flex-col gap-1"
                        >
                        {[
                            { name: "Pro", desc: "For teams scaling fast" },
                            { name: "Basic", desc: "For individuals" },
                            { name: "Premium", desc: "Full enterprise suite" },
                        ].map((plan) => (
                            <motion.li
                            key={plan.name}
                            variants={item}
                            className="group cursor-pointer rounded-lg px-3 py-2 transition-all duration-200 hover:bg-white/10
                            border-dashed border-gray-300 border-px
                            "
                            >
                            <h3 className="text-white text-sm font-medium">{plan.name}</h3>
                            <p className="text-gray-400 text-xs">{plan.desc}</p>
                            </motion.li>
                        ))}
                        </motion.ul>
                    </motion.div>
                    </div>

                <h1>About</h1>
                <h1>Examples</h1>

                <div className='flex items-center gap-2'>
                    <button className='px-2 font-semibold bg-black text-white rounded-sm' >Sign In</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar