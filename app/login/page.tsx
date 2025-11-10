import { JetBrains_Mono } from "next/font/google";
import React from "react";

// Initialize the font
const font = JetBrains_Mono({
    weight: "400",
    subsets: ["latin"]
});

// A custom utility component for the gradient button
const SoftButton = ({ children, icon: Icon, className = "" }) => (
    // Button container background changes from white/gray to a dark, subtle blue/gray for the 'soft' border effect
    <div className="w-full p-[1.5px] rounded-xl bg-gradient-to-t from-gray-300 to-white shadow-md dark:from-gray-700 dark:to-gray-900 dark:shadow-xl">
        <button
            className={`
                w-full rounded-xl py-2.5
                flex items-center justify-center gap-3
                text-gray-700 font-medium text-base
                bg-gradient-to-b from-white to-gray-100
                border border-gray-200
                shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.05)]
                hover:bg-gray-50
                active:translate-y-px active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                transition-all duration-150
                
                // --- Dark Mode Styles ---
                dark:text-gray-200
                dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900
                dark:border-gray-700
                dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)]
                dark:hover:bg-gray-700
                dark:active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]
                ${className}
            `}
        >
            {Icon && <Icon />}
            {children}
        </button>
    </div>
);

const Page = () => {
    
    // Icons remain the same, their fill color will inherit from the button text color in dark mode
    const AppleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 788 979">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
        </svg>
    );

    const GoogleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
            {/* Google icon colors remain bright for contrast */}
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.04l7.63 5.94c1.86-5.5 7.15-9.48 13.81-9.48z" />
            <path fill="#34A853" d="M46.85 24c0-1.57-.15-3.09-.38-4.55H24v9.01h12.71c-.75 4.33-3.37 7.74-7.65 10.02l7.56 5.86c3.48-6.1 5.48-13.99 5.48-22.34z" />
            <path fill="#FBBC05" d="M9.74 30.56c-.48-1.45-.76-2.99-.76-4.56s.27-3.11.76-4.56l-7.63-5.94C1.03 17.65 0 20.73 0 24s1.03 6.35 2.56 9.44l7.18-5.51z" />
            <path fill="#EA4335" d="M24 38.01c6.5 0 11.88-2.61 15.84-6.07l-7.56-5.86c-2.11 1.54-4.88 2.44-8.28 2.44-6.66 0-11.95-3.98-13.81-9.48l-7.63 5.94C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
        </svg>
    );

  return (
    // Main Container: Background changes from light gray to dark blue-gray
    <div className={`${font.className} w-screen h-screen flex flex-col md:flex-row p-4 bg-gray-100 dark:bg-gray-900`}>
      
      {/* Background Panels: Gradients adjusted for dark theme */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full 
        bg-[linear-gradient(166deg,#f5f5ff_0%,#a4c6f5_100%)] rounded-3xl overflow-hidden shadow-xl
        dark:bg-[linear-gradient(166deg,#1a202c_0%,#2c5282_100%)] dark:shadow-2xl">


        <div className="absolute inset-0 opacity-20 mask-[radial-gradient(ellipse_at_top,transparent_20%,#000)]" 
             style={{backgroundImage: 'repeating-linear-gradient(135deg, #ffffff44, #ffffff44 10px, transparent 10px, transparent 20px)'}}>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-1/2 md:h-full 
        bg-[linear-gradient(166deg,#a4c6f5_0%,#f5f5ff_100%)] rounded-3xl shadow-xl
        dark:bg-[linear-gradient(166deg,#2c5282_0%,#1a202c_100%)] dark:shadow-2xl">
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-3">
        <div
          className="
            w-[90%] sm:w-[400px] md:w-[450px]
            h-auto
            bg-white/50 backdrop-blur-md
            flex items-center justify-center
            p-2
            rounded-3xl
            shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.7)_inset]
            border border-white
            dark:bg-gray-800/70 dark:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(71,85,105,0.5)_inset]
            dark:border-gray-700
          "
        >
        
          <div className="relative w-full h-full bg-white/90 rounded-2xl p-6 dark:bg-gray-900/90">

        
            
            <div className="w-full mb-8">
              
                <div className="w-14 h-14 bg-[#4285F4] rounded-xl mb-3 shadow-lg flex items-center justify-center">
                   
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.5-3h-1.63c-.15 3.01-2.73 5.4-5.87 5.4-3.14 0-5.72-2.39-5.87-5.4H6.5c.18 3.39 2.94 6.13 6.3 6.4v3.1H11v1h2v-1h-1v-3.1c3.36-.27 6.12-3.01 6.3-6.4z"/></svg>
                </div>
              <h1 className="text-gray-900 font-extrabold text-3xl dark:text-white">
                PitchPerfect.ai
              </h1>
              <p className="text-blue-500 text-sm mt-1 font-medium">
                Your live AI pitch coach!
              </p>
            </div>


            <div className="w-full flex flex-col gap-3 mb-6">
                <SoftButton icon={AppleIcon}>
                    Login with Apple
                </SoftButton>
                <SoftButton icon={GoogleIcon}>
                    Login with Google
                </SoftButton>
            </div>


            <div className="flex items-center gap-3 w-full text-gray-400 text-sm mb-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-gray-500 dark:text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>


            <div className="w-full flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input
                id="email"
                type="email"
                placeholder="enter your email address..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-[#a4c6f5] focus:border-transparent 
                    transition-all duration-200 shadow-inner
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 dark:shadow-none
                    dark:focus:ring-[#4285F4]"
              />
              <button className="w-full bg-[#4285F4] text-white font-semibold rounded-xl py-2.5 mt-4 
                    hover:bg-[#3274e3] transition-colors duration-200 shadow-lg shadow-[#4285F4]/30
                    active:translate-y-px">
                Login with email
              </button>
            </div>

          </div>
            
        </div>
      </div>


    </div>
  );
};

export default Page;