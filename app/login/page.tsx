"use client"
import { signIn } from '@/lib/auth-client'
import { TASA_Orbiter } from 'next/font/google'
import Image from 'next/image'
import React from 'react'

const font = TASA_Orbiter({
  subsets: ["latin"],
  weight: "400"
})

const page = () => {
  return (
    <div className={`w-screen h-screen p-2 ${font.className}`}>
      <div className='w-full h-full flex justify-center items-center' style={{
    background: `linear-gradient(145deg, #15160F, #1A1B12)`,
  }}
>
        <div className='relative w-1/2 h-full flex justify-center items-center' 

        >
         <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0"
          width={950}
          height={200}
        >
          <defs>
            <linearGradient id="fade" x1="0%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#5f6732" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5f6732" stopOpacity="0" />
            </linearGradient>

            
            <pattern id="a" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                fill="none"
                stroke="url(#fade)"
                strokeLinecap="square"
                strokeWidth="0.6"
                d="M-5 5 5.1 15 15 5l10 10"
              />
            </pattern>
          </defs>

          
          <rect
            width="800%"
            height="800%"
            fill="url(#a)"
            transform="translate(-40 -160)"
          />
        </svg>

        <div className='w-[50%] h-[60%] flex flex-col p-3'>
          <div className='flex items-center gap-1'>
            <Image src={"vercel.svg"} alt='logo' width={16} height={16}/>
            <h1 className='text-accent text-lg font-semibold'>Pitchly</h1>
          </div>

          <div className='flex flex-col items-start mt-6 gap-3'>
            <h1 className='text-[35px] font-semibold max-w-sm text-[#f7fcdb]'>
              We see the ‘ums’ <br />  so you don’t sound like one.
            </h1>
            <div className='flex flex-col justify-center items-center mt-4 gap-3'>
             
            <button
              className="
                bg-[#8db378]
                text-black
                w-md
                py-2
                px-6
                rounded-xl
                font-semibold
                shadow-[0_4px_0_#6e8d5e]
                active:translate-y-0.5
                active:shadow-[0_2px_0_#6e8d5e]
                transition-all
                duration-150
                cursor-pointer
              "
              onClick={async () => {await signIn()}}
            >
              Google
            </button>

            <button
              className="
                bg-[#8db378]
                text-black
                w-md
                py-2
                px-6
                rounded-xl
                font-semibold
                shadow-[0_4px_0_#6e8d5e]
                active:translate-y-0.5
                active:shadow-[0_2px_0_#6e8d5e]
                transition-all
                duration-150
                cursor-pointer
              "
            >
              Apple
            </button>

              </div>

            <div className='flex items-center w-full gap-2 ml-1'>
              <div className='w-[45%] bg-[#4d532b] h-[0.5px]'></div>
              <div className='text-[#757e41]'>or</div>
              <div className='w-[45%] bg-[#4d532b] h-[0.5px]'></div>

            </div>

            <div className='flex flex-col justify-center items-start gap-3'>
                <div className="relative w-full">
                <input
                  type="email"
                  id="email"
                  className="
                    peer
                    w-full
                    border border-[#51572e]/70
                    bg-[#15160f]/30
                    rounded-lg
                    
                    px-3
                    pt-4
                    pb-2
                    text-sm
                    text-[#e9eecf]
                    placeholder-transparent
                    focus:outline-none
                    focus:border-[#8db378]
                    focus:ring-1
                    focus:ring-[#8db378]/40
                    transition-all
                    duration-200
                    backdrop-blur-sm
                  "
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="
                    absolute
                    left-3
                    top-3.5
                    text-[#b4b9a3]
                    text-sm
                    transition-all
                    duration-200
                    pointer-events-none
                    peer-placeholder-shown:top-3.5
                    peer-placeholder-shown:text-sm
                    peer-placeholder-shown:text-[#868b6f]
                    peer-focus:top-1
                    peer-focus:text-xs
                    peer-focus:text-[#a7c78b]
                  "
                >
                  Email
                </label>
              </div>

              

                <button
                  className="
                    bg-[#8db378]
                    text-black
                    w-md
                    py-2
                    px-6
                    rounded-xl
                    font-semibold
                    shadow-[0_4px_0_#6e8d5e]
                    active:translate-y-0.5
                    active:shadow-[0_2px_0_#6e8d5e]
                    transition-all
                    duration-150
                    cursor-pointer
                  "
                >
                  Continue with email
                </button>
                <p className='text-sm text-start leading-5 max-w-sm text-[#6e7c66]'>By signing up, you agree to our <strong>terms and conditions</strong> and <a target='_blank' href="/terms-and-condition"><strong>privacy policy</strong></a></p>
              </div>


            </div>
      
        </div>
        



        </div>
        <div
          className="w-1/2 h-full flex justify-center items-center px-2 pt-3"
          
        >
          <div className="relative w-[70%] h-full rounded-t-full border-[0.5px]
          border-gray-500 border-b-0 overflow-hidden">
            <Image
              src="/login2.png"
              alt="login-image"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page