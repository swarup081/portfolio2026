"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useAnimation, AnimatePresence, useMotionValue, useSpring, useMotionValueEvent } from "framer-motion";
import Menu from "./components/Menu";
import AboutMenu from "./components/AboutMenu";
import Stats from "./components/Stats";
import SuccessStories from "./components/SuccessStories";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MagnifyingChar({ children, index, mouseX, mouseY, delayOffset, waveKey }: any) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    if (!ref.current) return;
    const updatePos = () => {
      const rect = ref.current!.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    };
    setTimeout(updatePos, 100);
    window.addEventListener('resize', updatePos);
    return () => window.removeEventListener('resize', updatePos);
  }, []);

  const distance = useTransform([mouseX, mouseY], ([x, y]) => {
    if (x === -1000) return 1000;
    const dx = (x as number) - pos.x;
    const dy = (y as number) - pos.y;
    return Math.sqrt(dx * dx + dy * dy);
  });

  useEffect(() => {
    if (waveKey > 0 && distance.get() > 150) {
      controls.start({
        scaleY: [1, 1.12, 1],
        transition: {
          delay: (delayOffset + index) * 0.06,
          duration: 0.6,
          ease: "easeInOut",
        }
      });
    }
  }, [waveKey, controls, index, delayOffset, distance]);

  const scaleRaw = useTransform(distance, [0, 150], [1.12, 1], { clamp: true });
  const mxRaw = useTransform(distance, [0, 150], [3, 0], { clamp: true });

  const scale = useSpring(scaleRaw, { stiffness: 300, damping: 20 });
  const mx = useSpring(mxRaw, { stiffness: 300, damping: 20 });

  return (
    <motion.span
      ref={ref}
      style={{ scale, marginInline: mx, display: "inline-block", originY: "bottom" }}
      animate={controls}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
};

export default function Home() {
  const [phase, setPhase] = useState(0);
  const [menuPhase, setMenuPhase] = useState(0);
  const [waveKey, setWaveKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  // Yellow section mouse tracking for hover dots
  const yellowMouseX = useMotionValue(-1000);
  const yellowMouseY = useMotionValue(-1000);

  // Dark section mouse tracking for hover dots
  const darkMouseX = useMotionValue(-1000);
  const darkMouseY = useMotionValue(-1000);

  const handlePageMouseMove = (e: React.MouseEvent) => {
    // Top Hero area check
    if (e.clientY < window.innerHeight) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    } else {
      mouseX.set(-1000);
      mouseY.set(-1000);
    }

    // Yellow area check
    const isOverYellow = yellowSectionRef.current &&
      e.clientY >= yellowSectionRef.current.getBoundingClientRect().top &&
      e.clientY <= yellowSectionRef.current.getBoundingClientRect().bottom;

    if (isOverYellow) {
      yellowMouseX.set(e.clientX);
      yellowMouseY.set(e.clientY);
    } else {
      yellowMouseX.set(-1000);
      yellowMouseY.set(-1000);
    }

    // Dark area check
    const isOverDark = e.clientY > window.innerHeight * 2;
    if (isOverDark) {
      const topOfDark = window.innerHeight * 2;
      darkMouseX.set(e.clientX);
      darkMouseY.set(e.clientY - topOfDark);
    } else {
      darkMouseX.set(-1000);
      darkMouseY.set(-1000);
    }
  };

  const handlePageMouseLeave = () => {
    yellowMouseX.set(-1000);
    yellowMouseY.set(-1000);
    darkMouseX.set(-1000);
    darkMouseY.set(-1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(1);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setMenuPhase(1);
      setTimeout(() => {
        setMenuPhase(2);
      }, 600);
    }, 2500);

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveKey((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Scroll tracking for shutter reveal
  // Master wrapper tracks scroll for BOTH Hero (sticky) and Yellow (sticky)
  const masterSectionRef = useRef<HTMLDivElement>(null);
  const yellowSectionRef = useRef<HTMLElement>(null);
  const darkSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: masterSectionRef,
    offset: ["start start", "end end"] // 0 to 1 spans 200vh of scrolling
  });

  // Master Wrapper is 400vh. Scrollable distance is 300vh.
  // 0.1 progress = 30vh scroll. 0.433 progress = 130vh scroll.

  // 0 to 0.1: Hero scrolls up naturally (30vh gap).
  // 0.1 to 0.433: Rigid pyramid shape slides up (moves 100vh over 100vh of scroll, perfectly tracking).
  // 0.433 to 0.5: Pyramid flattens out to fill the screen.
  const centerOffset = useTransform(scrollYProgress, [0, 0.1, 0.433, 0.5, 1], ["100vh", "100vh", "0vh", "0vh", "0vh"]);
  const level2Offset = useTransform(scrollYProgress, [0, 0.1, 0.433, 0.5, 1], ["107vh", "107vh", "7vh", "0vh", "0vh"]);
  const level1Offset = useTransform(scrollYProgress, [0, 0.1, 0.433, 0.5, 1], ["118vh", "118vh", "18vh", "0vh", "0vh"]);

  // Hero scrolls at normal scroll speed for the entire wrapper duration
  const heroY = useTransform(scrollYProgress, [0, 1], ["0vh", "-300vh"]);

  // Yellow section stays perfectly still until 0.666, then moves up very slowly (parallax)
  const yellowY = useTransform(scrollYProgress, [0, 0.666, 1], ["0vh", "0vh", "-25vh"]);

  // Pills animate in from offscreen (0.2 to 0.45), sit still, then get pushed up by About page (0.75 to 1.0)
  const pillY = useTransform(scrollYProgress, [0.2, 0.45, 0.75, 1], ["50vh", "0vh", "0vh", "-50vh"]);
  const pillOpacity = useTransform(scrollYProgress, [0, 0.9], [0, 0.9]);

  const clipPath = useTransform(
    [level1Offset, level2Offset, centerOffset],
    ([lvl1, lvl2, center]) => `polygon(0% ${lvl1}, 20% ${lvl1}, 20% ${lvl2}, 40% ${lvl2}, 40% ${center}, 60% ${center}, 60% ${lvl2}, 80% ${lvl2}, 80% ${lvl1}, 100% ${lvl1}, 100% 100%, 0% 100%)`
  );

  const [isYellowSectionInView, setIsYellowSectionInView] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Trigger stroke animation when pyramid hits top of screen (0.433)
    if (latest > 0.433 && !isYellowSectionInView) {
      setIsYellowSectionInView(true);
    }
  });
  const signaturePath = "M 30 130 C 50 80, 70 30, 85 30 C 95 30, 105 80, 85 120 C 75 140, 50 130, 50 110 C 50 90, 90 110, 115 80 C 120 70, 125 100, 135 100 C 145 100, 145 85, 155 85 C 160 85, 160 100, 170 100 C 180 100, 180 90, 190 90 C 195 90, 200 105, 210 105 C 220 105, 225 80, 230 80 C 235 80, 220 135, 225 145 C 230 155, 245 90, 250 80 C 260 60, 275 80, 260 100 C 250 115, 270 100, 310 95";

  const title1 = "SWARUP'S".split("");
  const title2 = "PORTFOLIO".split("");

  const leftSideText = "Computer Science Engineer".split("");
  const rightSideText = "Studying at NIT Silchar".split("");

  return (
    <div
      className="relative w-full bg-[#F5F2EB] text-[#111111] font-sans flex flex-col"
      onMouseMove={handlePageMouseMove}
      onMouseLeave={handlePageMouseLeave}
    >
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d4d4d4 1px, transparent 1px),
            linear-gradient(to bottom, #d4d4d4 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px",
          backgroundPosition: "8px 8px"
        }}
      />

      <div className="fixed inset-0 pointer-events-none flex justify-center z-0">
        <div className="w-full h-full max-w-[88vw] xl:max-w-[1350px] border-x border-[#b3b3b3]" />
      </div>

      <div className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#151515] text-white w-10 py-6 rounded-l-lg z-50 flex flex-col items-center justify-center gap-6 shadow-xl hidden md:flex border-[1.5px] border-r-0 border-white/40">
        <div className="relative group flex items-center justify-center cursor-pointer" onClick={() => {
          navigator.clipboard.writeText("dasswarup112233@gmail.com");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}>
          <div className="font-bold text-lg leading-none">@</div>

          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 flex items-center">
            <div className="bg-[#151515] text-white text-xs whitespace-nowrap px-4 py-2 rounded-lg border border-white/10 shadow-lg flex flex-col gap-1 items-end">
              <span className="font-medium text-[13px]" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>dasswarup112233@gmail.com</span>
              <span className="text-white/60 text-[9px] uppercase tracking-wider">{copied ? "Copied!" : "Click to copy"}</span>
            </div>
            <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-[#151515] border-l-white/10 ml-[-1px]"></div>
          </div>
        </div>

        <div className="flex flex-col gap-5 items-center opacity-80">
          <a href="https://github.com/swarup081" target="_blank" rel="noreferrer" className="hover:opacity-100 hover:scale-110 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/swarup81/" target="_blank" rel="noreferrer" className="hover:opacity-100 hover:scale-110 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence mode="wait">
            {menuPhase === 2 && (
              <motion.div
                key="menu"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Menu />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative w-full">

        {/* SECTION 1 & 2 MASTER WRAPPER (400vh so it extends while About section slides over) */}
        <div ref={masterSectionRef} className="relative w-full h-[400vh]">

          {/* SECTION 1: Hero (Sticks for duration of master wrapper, but translates Y to scroll out) */}
          <div className="absolute inset-0 h-full w-full pointer-events-none">
            <motion.section
              style={{ y: heroY }}
              className="sticky top-0 flex flex-col justify-start h-screen w-full z-10 pointer-events-auto"
            >
              {/* Part 1: Main Title Area (100vh) */}
              <div className="relative flex flex-col items-center justify-center h-[100vh] min-h-[800px] w-full max-w-[88vw] xl:max-w-[1350px] mx-auto border-x border-[#b3b3b3]">

                <div className="absolute w-full px-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center w-full">

                    <div className="flex items-center justify-end w-full min-w-0">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2.2, ease: "easeInOut" }}
                        className="h-[1px] bg-[#b3b3b3] flex-grow origin-left min-w-[10px]"
                      />
                      <div
                        className={`relative flex-shrink-0 hidden md:block overflow-hidden h-[40px] transition-[width,opacity] duration-[1500ms] delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${phase === 1 ? "w-[240px] lg:w-[280px] xl:w-[320px] opacity-100" : "w-0 opacity-0"
                          }`}
                      >
                        <div
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-[240px] lg:w-[280px] xl:w-[320px] pr-3 sm:pr-6 md:pr-8 text-right whitespace-nowrap text-[#333] text-base md:text-lg lg:text-xl font-medium tracking-tight"
                          style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
                        >
                          {leftSideText.map((char, i) => (
                            <motion.span
                              key={i}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: phase === 1 ? 0 : 20, opacity: phase === 1 ? 1 : 0 }}
                              transition={{ duration: 0.6, delay: 0.4 + (leftSideText.length - 1 - i) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                              className="inline-block"
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center justify-center transition-all duration-1000 ${phase === 0 ? "w-[250px]" : "w-auto px-2 md:px-4"}`}>
                      <AnimatePresence>
                        {phase === 1 && (
                          <motion.div
                            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center justify-center leading-[0.85] pb-2 flex-shrink-0 pointer-events-auto cursor-pointer"
                          >
                            <h1
                              className="text-[12.5vw] md:text-[8.5vw] lg:text-[95px] font-bold tracking-[0.02em] uppercase text-[#151515] ml-[0.04em] flex"
                              style={{ fontFamily: "'Trobika', sans-serif" }}
                            >
                              {title1.map((char, index) => (
                                <MagnifyingChar key={index} index={index} mouseX={mouseX} mouseY={mouseY} delayOffset={0} waveKey={waveKey}>
                                  {char === " " ? "\u00A0" : char}
                                </MagnifyingChar>
                              ))}
                            </h1>
                            <h1
                              className="text-[12.5vw] md:text-[8.5vw] lg:text-[95px] font-bold tracking-[0.02em] uppercase text-[#151515] mr-[0.04em] flex"
                              style={{ fontFamily: "'Trobika', sans-serif" }}
                            >
                              {title2.map((char, index) => (
                                <MagnifyingChar key={index} index={index} mouseX={mouseX} mouseY={mouseY} delayOffset={8} waveKey={waveKey}>
                                  {char === " " ? "\u00A0" : char}
                                </MagnifyingChar>
                              ))}
                            </h1>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-start w-full min-w-0">
                      <div
                        className={`relative flex-shrink-0 hidden md:block overflow-hidden h-[40px] transition-[width,opacity] duration-[1500ms] delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${phase === 1 ? "w-[240px] lg:w-[280px] xl:w-[320px] opacity-100" : "w-0 opacity-0"
                          }`}
                      >
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[240px] lg:w-[280px] xl:w-[320px] pl-3 sm:pl-6 md:pl-8 text-left whitespace-nowrap text-[#333] text-base md:text-lg lg:text-xl font-medium tracking-tight"
                          style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
                        >
                          {rightSideText.map((char, i) => (
                            <motion.span
                              key={i}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: phase === 1 ? 0 : 20, opacity: phase === 1 ? 1 : 0 }}
                              transition={{ duration: 0.6, delay: 0.4 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                              className="inline-block"
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2.2, ease: "easeInOut" }}
                        className="h-[1px] bg-[#b3b3b3] flex-grow origin-right min-w-[10px]"
                      />
                    </div>

                  </div>
                </div>

                <div className="relative w-full flex flex-col items-center justify-center h-[400px]">

                  <motion.div
                    initial={{ y: 0, scale: 1 }}
                    animate={{
                      y: phase === 1 ? -320 : 0,
                      scale: phase === 1 ? 0.7 : 1,
                    }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute flex items-center justify-center z-20 pointer-events-none"
                  >
                    <svg
                      width="300"
                      height="145"
                      viewBox="0 0 300 145"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="overflow-visible"
                    >
                      <motion.path
                        d={signaturePath}
                        stroke="#D68A59"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.2 }}
                      />
                    </svg>
                  </motion.div>

                </div>

                <div className="absolute inset-0 pointer-events-none z-20 mix-blend-difference" />

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    <AnimatePresence mode="wait">
                      {menuPhase === 0 && (
                        <motion.div
                          key="intro"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.5, ease: "easeIn" }}
                          className="bg-[#3FA9F5] text-white px-6 py-2.5 rounded-full font-medium shadow-sm flex items-center text-base"
                          style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
                        >
                          {"Hey there!".split("").map((char, i) => (
                            <motion.span
                              key={i}
                              initial={{ display: "none" }}
                              animate={{ display: "inline" }}
                              transition={{ delay: 0.5 + i * 0.08 }}
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            className="ml-[2px] font-light inline-block w-[2px] h-[16px] bg-white translate-y-[1px]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Stats Area absolutely positioned near bottom */}
                <Stats scrollYProgress={scrollYProgress} />

              </div>

            </motion.section>
          </div>

          {/* SECTION 2: Yellow */}
          <div className="absolute inset-0 h-full w-full pointer-events-none z-20">
            <motion.section
              ref={yellowSectionRef}
              className="sticky top-0 h-screen w-full bg-[#fbe555] flex flex-col items-center justify-end overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pointer-events-auto"
              style={{ clipPath, WebkitClipPath: clipPath, y: yellowY }}
            >
              {/* Base small dots */}
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
                    [yellowMouseX, yellowMouseY],
                    ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, black, transparent)`
                  ),
                  WebkitMaskImage: useTransform(
                    [yellowMouseX, yellowMouseY],
                    ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, black, transparent)`
                  )
                }}
              />

              {/* Main Container with side borders (extends from hero) */}
              <main className="relative flex flex-col items-center justify-end min-h-screen h-full w-full max-w-[88vw] xl:max-w-[1350px] border-x border-[#b3b3b3]">

                {/* Squiggle Graphic behind image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl px-4 pointer-events-none opacity-90 flex justify-center">
                  <motion.img
                    src="/strokebg.png"
                    alt="Brush stroke"
                    className="w-[150%] md:w-[120%] lg:w-[110%] h-auto object-contain drop-shadow-md transform -rotate-2"
                    initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
                    animate={isYellowSectionInView ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" } : { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </div>

                {/* Animated Skill Pills */}
                <div className="absolute top-[65%] lg:top-[68%] left-1/2 -translate-x-1/2 w-full flex justify-center flex-wrap gap-8 md:gap-24 lg:gap-32 xl:gap-[15vw] z-30 pointer-events-auto">
                  <motion.div style={{ y: pillY, opacity: pillOpacity, fontFamily: "'Aeonik TRIAL', sans-serif" }} className="bg-[#151515] text-[#F5F2EB] px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg lg:text-xl tracking-wide font-medium shadow-2xl border border-white/10">Web Design</motion.div>
                  <motion.div style={{ y: pillY, opacity: pillOpacity, fontFamily: "'Aeonik TRIAL', sans-serif" }} className="bg-[#151515] text-[#F5F2EB] px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg lg:text-xl tracking-wide font-medium shadow-2xl border border-white/10">Web Development</motion.div>
                  <motion.div style={{ y: pillY, opacity: pillOpacity, fontFamily: "'Aeonik TRIAL', sans-serif" }} className="bg-[#151515] text-[#F5F2EB] px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg lg:text-xl tracking-wide font-medium shadow-2xl border border-white/10">Engineering</motion.div>
                </div>

                {/* Hero Image - Completely Fixed inside Shutter */}
                <img
                  src="/heroimageswarup.png"
                  alt="Swarup"
                  className="relative z-20 w-auto h-[90vh] md:h-[95vh] lg:h-[100vh] max-h-[1100px] object-contain object-bottom select-none drop-shadow-2xl translate-y-[1%]"
                />
              </main>
            </motion.section>
          </div>

        </div> {/* END MASTER WRAPPER */}

        {/* SECTION 3: About (Dark) - Base Layer */}
        <motion.section
          ref={darkSectionRef}
          className="relative min-h-screen w-full -mt-[100vh] bg-[#1E1E1E] flex flex-col items-center overflow-hidden z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] text-white"
        >
          {/* Base small dots (Match Yellow section 16px grid) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
              backgroundSize: "16px 16px"
            }}
          />

          {/* Hover large dots (magnified by cursor) */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-20 z-0"
            style={{
              backgroundImage: `radial-gradient(#ffffff 2px, transparent 2px)`,
              backgroundSize: "16px 16px",
              maskImage: useTransform(
                [darkMouseX, darkMouseY],
                ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, black, transparent)`
              ),
              WebkitMaskImage: useTransform(
                [darkMouseX, darkMouseY],
                ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, black, transparent)`
              )
            }}
          />

          {/* Main Container with borders */}
          <main className="relative w-full h-screen flex flex-col justify-center max-w-[88vw] xl:max-w-[1350px] border-x border-white/10 px-6 py-20 md:px-12 lg:px-20 z-10 gap-16 md:gap-12 lg:gap-20">

            {/* Hamburger Menu (Top Right) */}
            <div className="absolute top-8 right-6 md:right-12 lg:right-20 z-40">
              <button
                onClick={() => setIsAboutMenuOpen(true)}
                className="w-10 h-10 bg-transparent rounded-full flex flex-col justify-center items-center gap-[4px] cursor-pointer hover:scale-110 transition-all duration-300 group"
              >
                <div className="w-[20px] h-[1.5px] bg-white transition-transform duration-300 group-hover:-translate-x-1"></div>
                <div className="w-[20px] h-[1.5px] bg-white transition-transform duration-300 group-hover:translate-x-1"></div>
              </button>
            </div>

            <AboutMenu isOpen={isAboutMenuOpen} setIsOpen={setIsAboutMenuOpen} />

            <div className="flex flex-col w-full gap-24 lg:gap-36 mt-12 lg:mt-0">

              {/* Top Section */}
              <div className="flex flex-col w-full">
                {/* Logo aligned with HI */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                  className="font-bold text-2xl md:text-3xl lg:text-4xl mb-2 lg:mb-4"
                  style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
                >
                  नमस्ते
                </motion.div>

                {/* Top Row: HI I'M SWARUP */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-6"
                >
                  <h2 className="text-[11.5vw] lg:text-[95px] xl:text-[125px] leading-[0.8] tracking-normal uppercase whitespace-nowrap text-white" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", transform: "scaleY(1.15)", transformOrigin: "bottom left" }}>
                    HI ! I&apos;M SWARUP
                  </h2>
                  <div className="w-[280px] lg:w-[320px] flex-shrink-0 lg:pl-6">
                    <p className="text-[#888888] text-sm lg:text-[15px] font-light leading-[1.7]">
                      I&apos;ve been in the software industry crafting digital products that are useful & enjoyable for the final users.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Row: SOFTWARE ENGINEER */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
                className="flex flex-col-reverse lg:flex-row items-start lg:items-center justify-between w-full gap-6"
              >
                <div className="w-[280px] lg:w-[320px] flex-shrink-0 lg:pr-6">
                  <p className="text-[#888888] text-sm lg:text-[15px] font-light leading-[1.7]">
                    I&apos;ve worked on ambitious projects bringing design aesthetics with coding finesse to life, currently studying at NIT Silchar.
                  </p>
                </div>
                <h2 className="text-[11.5vw] lg:text-[95px] xl:text-[125px] leading-[0.8] tracking-normal uppercase whitespace-nowrap text-white" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", transform: "scaleY(1.15)", transformOrigin: "bottom right" }}>
                  SOFTWARE DEV
                </h2>
              </motion.div>

            </div>

          </main>
        </motion.section>

        {/* SECTION 4: Success Stories (Accordion) */}
        <SuccessStories />

      </div>
    </div>
  );
}
