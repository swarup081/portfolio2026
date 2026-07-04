"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AboutMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AboutMenu({ isOpen, setIsOpen }: AboutMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)", y: -10 }}
          animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
          exit={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)", y: -10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-2 right-0 md:right-6 lg:right-14 w-[90vw] max-w-[800px] bg-[#111111]/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 z-50 flex flex-col md:flex-row overflow-hidden text-white"
        >
          {/* Left Column: Navigation */}
          <div className="flex-1 p-8 md:p-12 flex flex-col">
            <h3 className="text-white/40 text-xs font-semibold tracking-[0.2em] uppercase mb-8">Navigation</h3>
            <div className="flex flex-col gap-5 w-fit relative z-10" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>
              {["Skills", "Experience", "Projects", "Awards", "Contact"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center gap-4 cursor-pointer"
                >
                  <span className="text-[28px] md:text-[32px] leading-none font-light tracking-wide text-white/60 group-hover:text-white transition-colors duration-300">
                    {item}
                  </span>
                  {/* Arrow Icon */}
                  <svg 
                    className="w-5 h-5 text-white/50 group-hover:text-[#FFE45E] transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Work With Me & Socials */}
          <div className="w-full md:w-[340px] bg-white/[0.03] p-8 md:p-12 flex flex-col relative border-t md:border-t-0 md:border-l border-white/10">
            
            {/* Top Right Close Button (Positioned to align with the = icon) */}
            <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex flex-col justify-center gap-[4px] items-center cursor-pointer hover:bg-white/10 hover:scale-110 transition-all duration-300 relative group"
              >
                <div className="w-[18px] h-[1.5px] bg-white absolute rotate-45 transition-transform group-hover:rotate-90"></div>
                <div className="w-[18px] h-[1.5px] bg-white absolute -rotate-45 transition-transform group-hover:-rotate-90"></div>
              </button>
            </div>

            <h3 className="text-white/40 text-xs font-semibold tracking-[0.2em] uppercase mb-8">Work With Me</h3>
            
            <p className="text-white/70 text-sm leading-relaxed mb-10 font-light">
              I specialize in crafting premium, high-performance web experiences that blend striking design with robust engineering. Let's build something exceptional together.
            </p>

            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="px-6 py-3 w-full rounded-full text-white text-xs font-semibold tracking-[0.2em] uppercase border border-white/20 hover:bg-[#FFE45E] hover:text-[#151515] hover:border-[#FFE45E] transition-all duration-300"
              style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
            >
              Hire Me
            </motion.button>

            {/* Socials */}
            <div className="mt-auto pt-10 flex gap-5 text-white/50">
              <a href="#" className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.4 5.4 0 0 0-.1 3.7 5.5 5.5 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path><path d="M9 18c-4.5 1.6-5-2.5-7-3"></path></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
