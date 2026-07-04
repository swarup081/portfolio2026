"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const curveVariants = {
    initial: {
      d: "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z"
    },
    open: {
      d: [
        "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z",
        "M 0 50 Q 50 0 100 50 L 100 100 L 0 100 Z",
        "M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z"
      ],
      transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1], times: [0, 0.5, 1] }
    },
    closed: {
      d: [
        "M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z",
        "M 0 50 Q 50 100 100 50 L 100 100 L 0 100 Z",
        "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z"
      ],
      transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1], times: [0, 0.5, 1] }
    }
  };

  return (
    <motion.div 
      animate={{ 
        width: isOpen ? 300 : 140, 
        height: isOpen ? 380 : 54,
        borderRadius: isOpen ? 32 : 27
      }}
      transition={{ 
        duration: 0.7, 
        ease: [0.76, 0, 0.24, 1]
      }}
      style={{ backgroundColor: "#FFE45E" }}
      className="relative border border-[#151515] overflow-hidden shadow-2xl cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Closed State Text */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-between px-6 z-10 text-[#151515]"
          >
            <span className="font-medium text-lg tracking-tight" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>Menu</span>
            <div className="flex flex-col gap-[5px]">
              <div className="w-5 h-[2px] bg-[#151515] rounded-full" />
              <div className="w-5 h-[2px] bg-[#151515] rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liquid SVG Layer */}
      <svg className="absolute w-[102%] h-[102%] -left-[1%] -top-[1%] pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path 
          fill="#1c1c1c"
          variants={curveVariants}
          initial="initial"
          animate={isOpen ? "open" : "closed"}
        />
      </svg>

      {/* Opened State Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="absolute inset-0 p-8 flex flex-col text-white z-30"
          >
            {/* Top Right Close Button */}
            <div className="absolute top-6 right-6">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Main Links */}
            <div className="flex flex-col gap-2 mt-2 w-fit" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>
              {["Home", "Work", "Services", "About", "Contact"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                  className="relative cursor-pointer text-[32px] leading-none font-normal tracking-tight group overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex">
                    {item.split("").map((char, ci) => (
                      <span
                        key={ci}
                        className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
                        style={{ transitionDelay: `${ci * 30}ms` }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-0 left-0 flex">
                    {item.split("").map((char, ci) => (
                      <span
                        key={ci}
                        className="inline-block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                        style={{ transitionDelay: `${ci * 30}ms` }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Secondary Links */}
            <div className="flex flex-col gap-1 mt-4 w-fit" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>
              {["Playground", "Skills"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
                  className="cursor-pointer text-base text-white/60 hover:text-white transition-colors duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item}
                </motion.div>
              ))}
            </div>

            {/* Bottom Right Hire Me CTA */}
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.1 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-6 right-6 px-5 py-2 rounded-full text-[#151515] text-sm font-medium tracking-widest hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'Aeonik TRIAL', sans-serif", backgroundColor: "#FFE45E" }}
            >
              HIRE ME
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
