"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const projects = [
  {
    year: "2026",
    title: "BizVistar",
    logoImage: "/bizvistarlogo.png",
    category: "WEB APP",
    image: "/bizvitsrarhome.png",
    link: "https://bizvistar.in"
  },
  {
    year: "2026",
    title: "IKS Project",
    logoText: "IKS Project",
    category: "ML APP",
    image: "",
    link: ""
  },
  {
    year: "2026",
    title: "Incand26",
    logoImage: "/incandlogo.ico",
    category: "FESTIVAL EVENTS",
    image: "/incandhome.png",
    link: "https://www.incand.in/"
  },
  {
    year: "2025",
    title: "E-Cell Website",
    logoText: "E-Cell Website",
    category: "CLUB WEBSITE",
    image: "/ecellhome.png",
    link: "https://www.ecellnits.org/"
  },
  {
    year: "2026",
    title: "Aegis",
    logoText: "Aegis",
    category: "AI FRAMEWORK",
    image: "/aegishome.png",
    link: "https://aegis-swarup.vercel.app/"
  },
  {
    year: "2025",
    title: "Kensho Journal",
    logoImage: "/kenshologo.png",
    category: "WEB APP",
    image: "/kenshohome.png",
    link: "https://kenshojournal.vercel.app/"
  }
];

export default function CuratedProjects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (listRef.current) {
        const rect = listRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="work" className="w-full bg-[#F5F2EB] text-[#111111] relative flex justify-center overflow-hidden">
      <div className="w-full max-w-[88vw] xl:max-w-[1350px] mx-auto border-x border-[#b3b3b3] pt-20 md:pt-32 pb-12" ref={gridRef}>
        
        {/* Header */}
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-24 lg:mb-32 px-6 md:px-12 lg:px-16">
          <h2 
            className="text-[10vw] lg:text-[85px] xl:text-[110px] leading-[0.9] tracking-tight uppercase whitespace-nowrap font-bold text-[#111]"
            style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }} 
          >
            PROJECTS
          </h2>
        </div>

        {/* List */}
        <div className="flex flex-col w-full relative" ref={listRef}>
          
          {/* Custom Cursor Button */}
          <motion.div 
            className="absolute top-0 left-0 z-50 pointer-events-none flex items-center justify-center"
            animate={{
              x: mousePos.x + 15, 
              y: mousePos.y + 15,
              opacity: hoveredIndex !== null ? 1 : 0,
              scale: hoveredIndex !== null ? 1 : 0.5
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.5,
              opacity: { duration: 0.15 }
            }}
          >
            <div className="bg-white text-[#111] px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              LIVE WEBSITE
            </div>
          </motion.div>

          <div className="border-t border-[#b3b3b3]">
            {projects.map((project, idx) => (
              <div 
                key={idx}
                className={`w-full border-b border-[#b3b3b3] relative cursor-pointer group transition-colors duration-500 ease-out ${
                  hoveredIndex === idx ? 'lg:bg-[#111] bg-transparent' : 'bg-transparent'
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => project.link && window.open(project.link, '_blank')}
              >
                {/* Desktop Layout (Hidden on Mobile) */}
                <div 
                  className={`hidden lg:flex w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex-row items-center justify-between px-16 ${
                    hoveredIndex === idx ? 'py-10' : 'py-1.5'
                  }`}
                >
                  
                  {/* Left: Year & Category */}
                  <div className="w-[30%] flex items-center justify-start z-10 pointer-events-none shrink-0">
                    <span className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-300 ${
                      hoveredIndex === idx ? 'text-[#aaa]' : 'text-[#666]'
                    }`}>
                      {project.year}, {project.category}
                    </span>
                  </div>

                  {/* Center: Hover Image & Title */}
                  <div className="flex-1 flex justify-start items-center z-10 pointer-events-none">
                    <div className="flex items-center">
                      {/* Hover Image Reveal */}
                      <div 
                        className="flex overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] items-center justify-start"
                        style={{ 
                          width: hoveredIndex === idx ? '240px' : '0px', 
                          opacity: hoveredIndex === idx ? 1 : 0,
                          marginRight: hoveredIndex === idx ? '32px' : '0px'
                        }}
                      >
                        {project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-[240px] h-[130px] object-contain rounded-xl shadow-2xl shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left" 
                            style={{ transform: hoveredIndex === idx ? 'scale(1)' : 'scale(0.8)' }}
                          />
                        ) : (
                          <div className="w-[240px] h-[130px] rounded-xl shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left border border-[#333] flex items-center justify-center bg-[#1a1a1a]" style={{ transform: hoveredIndex === idx ? 'scale(1)' : 'scale(0.8)' }}>
                            <span className="text-[#666] text-xs font-mono uppercase tracking-widest">Coming Soon</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 
                        className={`text-[48px] font-black leading-none transition-colors duration-300 tracking-tighter whitespace-nowrap ${
                          hoveredIndex === idx ? 'text-[#f5f5f5]' : 'text-[#111]'
                        }`} 
                        style={{ fontFamily: "'Aeonik TRIAL', sans-serif", transform: "scaleY(1.05)" }}
                      >
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Right: Icon */}
                  <div className="flex w-[10%] justify-end items-center z-10 pointer-events-none shrink-0">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                          className={`transition-colors duration-300 ${hoveredIndex === idx ? 'text-[#f5f5f5]' : 'text-[#111]'}`}>
                        <path d="M7 17l9.2-9.2M17 17V7H7"/>
                     </svg>
                  </div>

                </div>

                {/* Mobile Layout (Hidden on Desktop) */}
                <div className="flex flex-col lg:hidden w-full px-4 md:px-12 py-8 gap-5 pointer-events-none">
                  {/* Top Row: Title & Icon */}
                  <div className="flex justify-between items-start w-full gap-4">
                    <h3 className="text-[32px] md:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[#111]" style={{ fontFamily: "'Aeonik TRIAL', sans-serif", transform: "scaleY(1.05)" }}>
                      {project.title}
                    </h3>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#111] mt-1 shrink-0">
                      <path d="M7 17l9.2-9.2M17 17V7H7"/>
                    </svg>
                  </div>
                  
                  {/* Middle: Image */}
                  {project.image ? (
                    <div className="w-full">
                      <img src={project.image} alt={project.title} className="w-full h-auto object-cover rounded-md border border-[#111]/10" />
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-md border border-[#111]/10 flex items-center justify-center bg-[#111]/5">
                      <span className="text-[#666] text-xs font-mono uppercase tracking-widest">Coming Soon</span>
                    </div>
                  )}

                  {/* Bottom: Year & Category */}
                  <div className="w-full pt-1">
                    <span className="text-[13px] md:text-sm font-mono font-medium tracking-widest uppercase text-[#555]">
                      {project.year}, {project.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

