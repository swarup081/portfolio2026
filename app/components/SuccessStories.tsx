"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const stories = [
  {
    category: "Full-Stack Development",
    projects: "32 Projects Completed",
    title: "ENTERPRISE DASHBOARD",
    challenge: "Client lacked clarity on data metrics, leading to inefficient reporting and delayed decision-making processes.",
    solution: "Developed a centralized Next.js dashboard with real-time analytics, optimizing data fetching and rendering.",
    result: "In 3 months, we increased reporting efficiency by 45% and reduced manual data processing time by 30%."
  },
  {
    category: "System Architecture",
    projects: "15 Systems Scaled",
    title: "GLOBAL PAYMENT GATEWAY",
    challenge: "Existing legacy systems couldn't handle peak load during sales, resulting in transaction failures and revenue loss.",
    solution: "Re-architected the backend using microservices and implemented Redis caching and message queues.",
    result: "Achieved 99.99% uptime during peak holiday sales, processing 10,000+ TPS with zero downtime."
  },
  {
    category: "AI Integration",
    projects: "8 AI Products Launched",
    title: "SMART RECOMMENDATION ENGINE",
    challenge: "User engagement was stagnating due to generic content delivery and poor personalization.",
    solution: "Integrated a custom machine learning pipeline to analyze user behavior and serve highly personalized content.",
    result: "Increased daily active users by 25% and boosted average session duration by over 40%."
  }
];

export default function SuccessStories() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-[#F5F2EB] text-[#111111] py-24 md:py-32 relative flex justify-center">
      <div className="w-full max-w-[88vw] xl:max-w-[1350px]">
        {/* Title */}
        <div className="mb-12 md:mb-20">
          <h2 
            className="text-[12vw] md:text-[9vw] lg:text-[120px] font-bold leading-[0.85] tracking-tight uppercase"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", transform: "scaleY(1.1)", transformOrigin: "bottom left" }}
          >
            SUCCESS STORIES
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="w-full border-t border-[#111111]">
          {stories.map((story, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <div key={idx} className="w-full flex flex-col md:flex-row border-b border-[#111111] cursor-pointer group" onClick={() => setOpenIndex(isOpen ? null : idx)}>
                
                {/* Left Column (Category) */}
                <div className="w-full md:w-[30%] py-8 pr-6 md:border-r border-[#111111] flex flex-col justify-start">
                  <h3 className="text-base md:text-lg font-bold mb-1 group-hover:text-[#333] transition-colors">{story.category}</h3>
                  {story.projects && (
                    <span className="text-sm text-[#555]">({story.projects})</span>
                  )}
                </div>

                {/* Right Column (Content) */}
                <div className="w-full md:w-[70%] py-8 md:pl-10 relative overflow-hidden">
                  
                  {/* Title & Indicator */}
                  <div className="flex justify-between items-start w-full">
                    <h3 
                      className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight group-hover:text-[#333] transition-colors"
                      style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", transform: "scaleY(1.1)", transformOrigin: "bottom left" }}
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
                        animate={{ height: "auto", opacity: 1, marginTop: "48px" }}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
