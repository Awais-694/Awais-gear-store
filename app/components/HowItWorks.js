"use client";

import { useState, useEffect } from "react";

export default function HowItWorks() {
  // Track active image index (0 to 8 for the 9 images)
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    { src: "/hero1.jpg", step: 0, badge: "CREATIVE ART" },
    { src: "/hero2.jpg", step: 0, badge: "STREETWEAR" },
    { src: "/hero3.jpg", step: 0, badge: "MINIMALIST" },
    { src: "/hero4.jpg", step: 1, badge: "PERFECT FIT" },
    { src: "/hero5.jpg", step: 1, badge: "PREMIUM COTTON" },
    { src: "/hero6.jpg", step: 1, badge: "COZY SIZING" },
    { src: "/hero7.jpg", step: 2, badge: "FAST SHIPPING" },
    { src: "/hero8.jpg", step: 2, badge: "DOORSTEP DELIVERY" },
    { src: "/hero9.jpg", step: 2, badge: "SECURE PACKAGING" },
  ];

  const steps = [
    {
      title: "01. Curated Artwork",
      subtitle: "Every month, our artists design unique, limited-edition graphic tees tailored for premium streetwear.",
      startIndex: 0
    },
    {
      title: "02. Select Your Fit",
      subtitle: "Choose your size and color preferences. Engineered for absolute comfort and tailored for the streets.",
      startIndex: 3
    },
    {
      title: "03. Seamless Delivery",
      subtitle: "Fresh gear delivered directly to your doorstep. Skip, swap, or cancel anytime with zero commitments.",
      startIndex: 6
    }
  ];

  // Auto-play interval: cycles through all 9 images (every 1.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 1500);

    return () => clearInterval(timer);
  }, [images.length]);

  // Determine active step based on current active image index
  const activeStep = images[activeIndex].step;

  return (
    <div className="bg-[#f4f6f2] rounded-[32px] p-6 sm:p-12 border border-neutral-200/50 space-y-8">
      <div className="max-w-md">
        <span className="text-[10px] bg-black/5 text-neutral-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          How It Works
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight mt-3">
          Fresh curated tees, delivered monthly.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Step Selectors */}
        <div className="lg:col-span-6 space-y-4">
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(step.startIndex)}
                onMouseEnter={() => setActiveIndex(step.startIndex)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#e4e8e1] border-[#d8dcd5] shadow-sm translate-x-1"
                    : "bg-white/50 border-transparent hover:bg-white hover:border-gray-200"
                }`}
              >
                <h3 className="text-sm sm:text-base font-black text-neutral-900 uppercase">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-medium leading-relaxed">
                  {step.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Side: Dynamic Image Frame with Cross-Fade */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <div className="relative w-full max-w-[420px] aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-md border border-neutral-200/40 p-4 flex items-center justify-center">
            
            {/* Round Badge Overlay */}
            <span className="absolute top-6 right-6 bg-black text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest z-20 shadow-md">
              {images[activeIndex].badge}
            </span>

            {/* Cross-fading Images */}
            {images.map((img, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className={`absolute inset-4 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${
                    isActive
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-95 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.badge}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-neutral-900/5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
