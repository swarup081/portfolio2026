'use client';

import { motion, useMotionValue, useTransform, useScroll, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import PixelAnimation from './PixelAnimation';

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const isTextInView = useInView(textRef, { once: true, amount: 0.5 });
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 50%", "start 5%"]
  });

  const centerOffset = useTransform(scrollYProgress, [0, 0.6, 1], ["100%", "0%", "0%"]);
  const level2Offset = useTransform(scrollYProgress, [0, 0.6, 1], ["100%", "10%", "0%"]);
  const level1Offset = useTransform(scrollYProgress, [0, 0.6, 1], ["100%", "20%", "0%"]);

  const clipPath = useTransform(
    [level1Offset, level2Offset, centerOffset],
    ([lvl1, lvl2, center]) => `polygon(0% ${lvl1}, 20% ${lvl1}, 20% ${lvl2}, 40% ${lvl2}, 40% ${center}, 60% ${center}, 60% ${lvl2}, 80% ${lvl2}, 80% ${lvl1}, 100% ${lvl1}, 100% 100%, 0% 100%)`
  );

  const text = "SWARUP";
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  useEffect(() => {
    // If the screen is mobile (text is hidden), start pixel animation immediately
    const mql = window.matchMedia('(max-width: 767px)');
    if (mql.matches) {
      setTextAnimationComplete(true);
    }
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setTextAnimationComplete(true);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Check if mouse is within the footer
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          mouseX.set(e.clientX - rect.left);
          mouseY.set(e.clientY - rect.top);
        } else {
          mouseX.set(-1000);
          mouseY.set(-1000);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full bg-[#F5F2EB]">
      {/* Background Vertical Lines to connect Projects to Footer seamlessly */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[88vw] xl:max-w-[1350px] border-x border-[#b3b3b3] pointer-events-none z-0" />

      <motion.section 
        id="contact"
        ref={sectionRef} 
        className="relative h-screen w-full bg-[#fbe555] flex flex-col items-center justify-between overflow-hidden z-20 text-[#111]"
        style={{ clipPath, WebkitClipPath: clipPath }}
      >
        
        {/* Base small dots (Match Yellow section 16px grid) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ 
            backgroundImage: `radial-gradient(#151515 1px, transparent 1px)`,
            backgroundSize: "16px 16px"
          }}
        />

        {/* Hover large dots (magnified by cursor) */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
          style={{
            backgroundImage: `radial-gradient(#151515 2px, transparent 2px)`,
            backgroundSize: "16px 16px",
            maskImage: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, black, transparent)`
            ),
            WebkitMaskImage: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, black, transparent)`
            )
          }}
        />

        {/* Main Container - Pyramid Structure */}
        <div className="relative w-full max-w-[88vw] xl:max-w-[1350px] mx-auto border-x border-[#111]/20 flex flex-col pt-16 md:pt-20 lg:pt-24 flex-grow justify-end md:justify-center">
          
          {/* Massive Background Text & Pixel Art */}
          <div className="relative w-full flex flex-col items-center justify-center pointer-events-none select-none z-20 flex-grow translate-y-0">
            {/* Background Text */}
            <motion.h1 
              ref={textRef}
              className="hidden md:flex justify-center text-[28vw] md:text-[18vw] lg:text-[15vw] xl:text-[20vw] leading-[0.75] font-black text-center uppercase tracking-tighter text-black/5 mix-blend-multiply w-full px-4"
              style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
            >
              {text.split('').map((char, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate={isTextInView ? "visible" : "hidden"}
                  variants={textVariants}
                  onAnimationComplete={() => {
                    if (index === text.length - 1) {
                      setTextAnimationComplete(true);
                    }
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Pixel Art Overlay */}
            <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-[45%] z-10 w-[350px] md:w-[350px] lg:w-[300px] xl:w-[400px] translate-y-8 md:translate-y-12 xl:translate-y-0 pointer-events-none">
              <PixelAnimation src="/pixeleatedme.png" startAnimation={textAnimationComplete} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="relative w-full border-t border-[#111]/20 px-6 md:px-12 lg:px-20 py-8 md:py-12 mt-auto z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full max-w-[88vw] xl:max-w-[1350px] mx-auto px-0 lg:px-0">
              
              {/* Left Side */}
              <div className="flex flex-col mb-12 md:mb-0">
                <p className="text-lg md:text-xl font-medium mb-2">Let&apos;s build something</p>
                <h2 
                  className="text-[10vw] sm:text-5xl lg:text-[80px] font-black uppercase tracking-tighter leading-[0.9]"
                  style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
                >
                  MEANINGFUL<br />AND MEMORABLE
                </h2>
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-start md:items-end gap-6 mb-2">
                <span className="text-sm font-medium uppercase tracking-widest text-[#111]/70">Reach out</span>
                <div className="flex items-center gap-4">
                  <a href="https://www.instagram.com/swarup_81/" target="_blank" rel="noreferrer" className="p-3.5 border border-[#111] rounded-full hover:bg-[#111] hover:text-[#fdf03e] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/swarup81/" target="_blank" rel="noreferrer" className="p-3.5 border border-[#111] rounded-full hover:bg-[#111] hover:text-[#fdf03e] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href="mailto:dasswarup.work@gmail.com" className="p-3.5 border border-[#111] rounded-full hover:bg-[#111] hover:text-[#fdf03e] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </motion.section>
    </div>
  );
}
