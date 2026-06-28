"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ProductCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, products.length - 1);
  const autoPlayRef = useRef(null);

  // Auto-play the carousel
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex, products]);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (products.length > 1) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  if (!products || products.length === 0) return null;

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-r from-gray-900 to-neutral-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl border border-gray-800"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />

      {/* Main active item content */}
      <div className="w-full md:w-1/2 space-y-4 md:space-y-6 relative z-10 order-2 md:order-1">
        <span className="inline-block text-[10px] bg-blue-500/25 text-blue-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">
          Featured Product
        </span>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight line-clamp-2">
            {products[currentIndex].title}
          </h2>
          <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-3">
            {products[currentIndex].description || "No description available for this premium item."}
          </p>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-black text-white">
            ${products[currentIndex].price ? products[currentIndex].price.toFixed(2) : "0.00"}
          </span>
          {products[currentIndex].category && (
            <span className="text-xs text-gray-400 uppercase font-semibold">
              in {products[currentIndex].category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              // Add to cart helper
              const cart = JSON.parse(localStorage.getItem("awais_cart") || "[]");
              const existingItem = cart.find((item) => item._id === products[currentIndex]._id);
              if (existingItem) {
                existingItem.quantity += 1;
              } else {
                cart.push({
                  _id: products[currentIndex]._id,
                  title: products[currentIndex].title,
                  price: products[currentIndex].price,
                  image: products[currentIndex].image,
                  quantity: 1,
                });
              }
              localStorage.setItem("awais_cart", JSON.stringify(cart));
              window.dispatchEvent(new Event("cart-updated"));
              window.dispatchEvent(new CustomEvent("show-toast", {
                detail: { message: `Added ${products[currentIndex].title} to cart!`, type: "success" }
              }));
            }}
            className="bg-white text-black hover:bg-gray-100 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition active:scale-[0.98] cursor-pointer"
          >
            Add to Cart
          </button>
          
          <div className="flex gap-2">
            {products[currentIndex].colors?.slice(0, 3).map((col) => (
              <span key={col} className="text-[10px] bg-white/10 px-2.5 py-1 rounded-lg font-bold capitalize">
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Product Image Viewer */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative order-1 md:order-2 h-64 md:h-72">
        <div className="relative w-48 md:w-56 h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-500 hover:scale-105">
          <img
            src={products[currentIndex].image}
            alt={products[currentIndex].title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black border border-white/10 flex items-center justify-center pointer-events-auto text-white transition active:scale-95"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black border border-white/10 flex items-center justify-center pointer-events-auto text-white transition active:scale-95"
          >
            →
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
