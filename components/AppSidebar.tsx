"use client";

import { useState } from "react";
import {
  Home,
  Plus,
  SettingsIcon,
  BrainIcon,
  Camera,
  HistoryIcon,
  Square,
  X
} from "lucide-react";
import { Inconsolata } from "next/font/google";
import { motion } from "motion/react";
import Image from "next/image";
import ThemeToggle from "./theme-toggler";
import { useModalStore } from "@/store/modalStore";

const font = Inconsolata({
  weight: "400",
  subsets: ["latin"],
});

export function AppSidebar({ className }: { className: string }) {
  const [activeItem, setActiveItem] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const {openRecordModal} = useModalStore();

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "Practice", label: "Practice", icon: BrainIcon },
    { id: "Record", label: "Record", icon: Camera },
    { id: "History", label: "History", icon: HistoryIcon },
    { id: "PitchTypes", label: "Templates", icon: Square },
  ];

  const textAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.22 }
    },
    exit: {
      opacity: 0,
      x: -6,
      transition: { duration: 0.28 }
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleOpen = () => {
    if (isMobile) setIsOpen((prev) => !prev);
    else setIsOpen(true);
  };

  const handleClose = () => {
    if (isMobile) setIsOpen(false);
    else setIsOpen(false);
  };

  return (
    <motion.aside
      onMouseEnter={!isMobile ? handleOpen : undefined}
      onMouseLeave={!isMobile ? handleClose : undefined}
      animate={{ width: isOpen ? 260 : 70 }}
      transition={{ type: "spring", duration: 0.15, damping: 18 }}
      className={`${font.className} ${className} h-full bg-white dark:bg-neutral-900 border-r border-border dark:border-neutral-700 flex flex-col shadow-sm overflow-hidden`}
    >

      <div
        className={`flex items-center ${
          isOpen ? "justify-between p-2" : "justify-center p-3"
        } gap-3 border-b border-border dark:border-neutral-700`}
      >
        {isOpen ? (
          <motion.span
            variants={textAnimation}
            initial="hidden"
            animate="show"
            exit={"exit"}
            className="text-[16px] font-semibold whitespace-nowrap text-foreground dark:text-neutral-100"
          >
            PitchPerfect
          </motion.span>
        ) : (
          <Image
            src={"/vercel.svg"}
            alt="logo"
            height={20}
            width={20}
            className="opacity-90"
          />
        )}

        {isMobile && isOpen && (
          <button onClick={handleClose}>
            <X className="text-neutral-700 dark:text-neutral-300" />
          </button>
        )}
      </div>

      <div className="border-b border-border dark:border-neutral-700">
        <button
          className={`w-full flex items-center ${
            isOpen ? "py-2" : "py-3 ml-2"
          } gap-3 px-4  hover:bg-muted dark:hover:bg-neutral-800 transition-colors text-foreground dark:text-neutral-200 font-medium`}
           onClick={() => openRecordModal()}
        >
          <Plus size={17} className="min-w-5" />
          {isOpen && <span className="whitespace-nowrap">New pitch</span>}
        </button>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <motion.button
              key={item.id}
              variants={textAnimation}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-5 border border-t-0 border-r-0 border-l-0 border-border/40 dark:border-white/10 rounded-none transition-all overflow-x-hidden ${
                isActive
                  ? "bg-muted dark:bg-neutral-800 text-foreground dark:text-white shadow-sm"
                  : "hover:bg-muted/40 dark:hover:bg-neutral-800 text-foreground dark:text-neutral-300"
              }`}
            >
              <Icon size={18} className={`min-w-5 ${isOpen ? "": "ml-2"}`} />
              {isOpen && (
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              )}
            </motion.button>
          );
        })}
      </nav>
      <div className="px-2 py-4 border-t border-border dark:border-neutral-700 space-y-4">
        <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted/40 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300`}>
          <SettingsIcon className="min-w-6" />
          {isOpen && <span className="text-sm font-medium">Settings</span>}
        </button>

        <ThemeToggle />
      </div>
    </motion.aside>
  );
}
