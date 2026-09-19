"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const stories = [
  {
    category: "Technical Intern (May 2026 - Present)",
    title: "IKS DIVISION, MINISTRY OF EDUCATION",
    challenge: "The 'Raag Origins of Indian Traditional Folk Music' research project lacked infrastructure for data collection and audio classification.",
    solution: "Architected web and mobile app infrastructure and designed Machine Learning models to analyze complex audio features.",
    result: "Successfully facilitated scalable data collection and highly accurate classification of raag origins in traditional folk datasets."
  },
  {
    category: "Mastercard Finalist (Aug 2026)",
    title: "AEGIS: AI vs AI PAYMENT SECURITY",
    challenge: "Needed an advanced, automated system to defend against rapidly evolving, adversarial payment fraud in the Indian ecosystem (UPI, IMPS, RTGS).",
    solution: "Architected an end-to-end AI-vs-AI simulation using a Reinforcement Learning agent to generate adversarial scenarios, paired with an XGBoost model for real-time fraud detection. Built FastAPI REST APIs and a Next.js dashboard with WebSockets.",
    result: "Successfully modeled the payment ecosystem and generated 30,000+ synthetic transactions, providing real-time analytics and robust end-to-end system validation."
  },
  {
    category: "Junior Technical Member (Aug 2025 - Present)",
    title: "E-CELL FULL-STACK PLATFORM",
    challenge: "The organization lacked a secure backend infrastructure and struggled with platform performance, limiting visibility and digital user acquisition.",
    solution: "Developed the backend from scratch, integrated strict Google Sign-In authentication, and deployed a high-performance frontend landing page.",
    result: "Significantly enhanced club visibility, streamlined access, and provided secure data management for 100+ active student users."
  }
];

export default function SuccessStories() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="stories" className="w-full bg-[#F5F2EB] text-[#111111] relative flex justify-center">
      <div className="w-full max-w-[88vw] xl:max-w-[1350px] mx-auto border-x border-[#b3b3b3] py-32 md:py-48">
        {/* Title */}
        <div className="mb-12 md:mb-20 px-6 md:px-12 lg:px-20">
          <h2 
            className="text-[10vw] lg:text-[85px] xl:text-[110px] leading-[0.9] tracking-tight uppercase font-bold text-[#111]"
            style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
          >
            SUCCESS STORIES
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="w-full border-t border-[#111111]">
          {stories.map((story, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <button 
                key={idx}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex flex-col md:flex-row border-b border-[#111111] group text-left"
              >
                
                {/* Left Column (Category) */}
                <div className="w-full md:w-[30%] py-8 px-6 md:pl-12 lg:pl-20 md:pr-6 md:border-r border-[#111111] flex flex-col justify-start">
                  <h3 className="text-base md:text-lg font-bold mb-1 group-hover:text-[#333] transition-colors">{story.category}</h3>
                </div>

                {/* Right Column (Content) */}
                <div className="w-full md:w-[70%] py-8 px-6 md:pl-10 md:pr-12 lg:pr-20 relative">
                  
                  {/* Title & Indicator */}
                  <div className="flex justify-between items-start w-full">
                    <h3 
                      className="text-4xl md:text-5xl lg:text-[48px] font-black leading-none uppercase tracking-tighter transition-colors duration-300 group-hover:text-[#333]"
                      style={{ fontFamily: "'Aeonik TRIAL', sans-serif" }}
                    >
                      {story.title}
                    </h3>
                    <div className="mt-2 w-2 h-2 rounded-full bg-[#111111] flex-shrink-0 transition-transform duration-300" style={{ transform: isOpen ? "scale(1.5)" : "scale(1)" }} />
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: "8rem" }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-4">
                          <div className="flex flex-col">
                            <h4 className="font-bold text-sm mb-3">Challenge</h4>
                            <p className="text-sm text-[#444] leading-relaxed pr-4">
                              {story.challenge}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <h4 className="font-bold text-sm mb-3">Solution</h4>
                            <p className="text-sm text-[#444] leading-relaxed pr-4">
                              {story.solution}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <h4 className="font-bold text-sm mb-3">Result</h4>
                            <p className="text-sm text-[#444] leading-relaxed pr-4">
                              {story.result}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
