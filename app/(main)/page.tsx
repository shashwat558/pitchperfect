"use client"
import HomeSection from "@/components/HomeSection";
import Navbar from "@/components/Navbar";

import { PATTERNS } from "@/lib/utils";


export default function Home() {
  return (
    <div className="w-full h-full" >
      <Navbar className=""/>
      <div className="w-full flex justify-center">
      <div
        
        className="w-[88%] h-5 pointer-events-none dark:opacity-[0.17] opacity-[0.15]"
        style={{
          backgroundImage: PATTERNS.diagonalElegant,
        }}
      />
      </div>
      <HomeSection />
    

      
      
    </div>
  );
}
