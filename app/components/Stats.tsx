"use client";

import { motion, MotionValue, useTransform, animate, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ value, suffix = "", prefix = "", scrollYProgress }: { value: number, suffix?: string, prefix?: string, scrollYProgress: MotionValue<number> }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      // Trigger counter a bit later to match the delayed entrance
      if (v > 0.05 && !hasTriggered) {
        setHasTriggered(true);
      }
    });
    return unsubscribe;
  }, [scrollYProgress, hasTriggered]);

  useEffect(() => {
    if (hasTriggered) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(v) {
          if (value % 1 !== 0) {
            setDisplayValue(v.toFixed(1));
          } else {
            setDisplayValue(Math.round(v).toString());
          }
        }
      });
      return controls.stop;
    }
  }, [value, hasTriggered]);

  return <>{prefix}{displayValue}{suffix}</>;
};

export default function Stats({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Animate in slightly later so the gap feels bigger naturally (0.03 to 0.1 of 400vh)
  const rawOpacity = useTransform(scrollYProgress, [0.03, 0.1], [0, 1]);
  const rawY = useTransform(scrollYProgress, [0.03, 0.1], [50, 0]);

  // Use spring for a buttery smooth entrance
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 20 });
  const y = useSpring(rawY, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      style={{ opacity, y }}
      // Push slightly lower to increase gap by a small bit from title
      className="absolute bottom-4 lg:bottom-[-10px] w-full max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 items-center gap-y-12 md:gap-y-0 pointer-events-auto"
    >
      {/* Col 1 */}
      <motion.div className="flex flex-col md:border-l border-[#b3b3b3] md:pl-8 lg:pl-10 h-auto md:h-[180px] justify-between py-2 -translate-y-4">
        <span className="text-6xl lg:text-[75px] font-bold text-[#111] leading-none tracking-tight mb-8 md:mb-0" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>
          <AnimatedCounter value={100} suffix="+" scrollYProgress={scrollYProgress} />
        </span>
        <span className="text-sm lg:text-[15px] text-[#333] font-medium leading-snug">
          Engineering Problems<br />Solved
        </span>
      </motion.div>

      {/* Col 2 */}
      <motion.div className="flex flex-col md:border-l border-[#b3b3b3] md:pl-8 lg:pl-10 h-auto md:h-[180px] justify-end py-2 md:pb-2 relative translate-y-8">
        <div className="absolute top-0 left-0 w-[1px] h-1/2 bg-[#F5F2EB] hidden md:block z-10 -ml-[1px]" /> {/* Masks the top half of the border */}
        <span className="text-6xl lg:text-[75px] font-bold text-[#111] leading-none tracking-tight mb-8 md:mb-12" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>
          <AnimatedCounter value={1.7} suffix=" L+" scrollYProgress={scrollYProgress} />
        </span>
        <span className="text-sm lg:text-[15px] text-[#333] font-medium leading-snug">
          Lines of Code<br />Written
        </span>
      </motion.div>

      {/* Col 3 */}
      <motion.div className="flex flex-col md:border-l border-[#b3b3b3] md:pl-8 lg:pl-10 h-auto md:h-[180px] justify-between py-2 -translate-y-2">
        <span className="text-6xl lg:text-[75px] font-bold text-[#111] leading-none tracking-tight mb-8 md:mb-0" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>
          <AnimatedCounter value={25} suffix="+" scrollYProgress={scrollYProgress} />
        </span>
        <span className="text-sm lg:text-[15px] text-[#333] font-medium leading-snug">
          Full-Stack Projects<br />Shipped
        </span>
      </motion.div>

      {/* Col 4 */}
      <motion.div className="flex flex-col md:border-l md:border-r border-[#b3b3b3] md:px-8 lg:px-10 h-auto md:h-[180px] justify-center py-2 translate-y-4">
        <span className="text-6xl lg:text-[75px] font-bold text-[#111] leading-none tracking-tight mb-4" style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}>
          <AnimatedCounter value={1000} suffix="+" scrollYProgress={scrollYProgress} />
        </span>
        <span className="text-sm lg:text-[15px] text-[#333] font-medium leading-snug">
          Hours Dedicated to<br />Debugging & Architecture
        </span>
      </motion.div>
    </motion.div>
  );
}
