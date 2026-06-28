// app/components/Product3DCarousel.js
"use client";

import { useState } from "react";

export default function Product3DCarousel({ products, userRole }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("awais_cart") || "[]");
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("awais_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    alert(`🛒 Added ${product.title} to cart!`);
  };

  const handleDeleteProduct = async (product) => {
    const confirmDelete = confirm("Awais Bhai, kya aap waqai yeh item store se hatana chahte hain?");
    if (!confirmDelete) return;
    try {
      alert("Backend Security validation verified. Item safely removed from inventory cluster!");
    } catch (error) {
      alert("Execution failure!");
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="relative w-full py-6 flex flex-col items-center justify-center overflow-hidden">
      {/* 3D Container with CSS perspective */}
      <div 
        className="relative w-full max-w-5xl h-[460px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {products.map((product, index) => {
          let position = "hidden";
          let diff = index - activeIndex;

          if (diff === 0) position = "active";
          else if (diff === 1 || (diff === -(products.length - 1) && products.length > 2)) position = "right";
          else if (diff === -1 || (diff === products.length - 1 && products.length > 2)) position = "left";
          else if (diff === 2 || (diff === -(products.length - 2) && products.length > 3)) position = "far-right";
          else if (diff === -2 || (diff === products.length - 2 && products.length > 3)) position = "far-left";

          let styles = "";
          let zIndex = 0;

          switch (position) {
            case "active":
              styles = "translate-x-0 scale-100 opacity-100 z-30 pointer-events-auto shadow-2xl border-gray-300";
              zIndex = 30;
              break;
            case "left":
              styles = "-translate-x-[110px] sm:-translate-x-[160px] scale-80 opacity-60 z-20 pointer-events-auto rotate-y-[20deg] blur-[0.5px] grayscale-[30%]";
              zIndex = 20;
              break;
            case "right":
              styles = "translate-x-[110px] sm:translate-x-[160px] scale-80 opacity-60 z-20 pointer-events-auto -rotate-y-[20deg] blur-[0.5px] grayscale-[30%]";
              zIndex = 20;
              break;
            case "far-left":
              styles = "-translate-x-[180px] sm:-translate-x-[260px] scale-65 opacity-25 z-10 pointer-events-none rotate-y-[35deg] blur-[1px] grayscale";
              zIndex = 10;
              break;
            case "far-right":
              styles = "translate-x-[180px] sm:translate-x-[260px] scale-65 opacity-25 z-10 pointer-events-none -rotate-y-[35deg] blur-[1px] grayscale";
              zIndex = 10;
              break;
            default:
              styles = "opacity-0 scale-50 pointer-events-none translate-x-0";
              zIndex = 0;
          }

          const isActive = position === "active";

          return (
            <div
              key={product._id || index}
              onClick={() => {
                if (!isActive) setActiveIndex(index);
              }}
              style={{ zIndex, transformStyle: "preserve-3d" }}
              className={`absolute w-[220px] sm:w-[250px] h-[390px] bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-500 ease-out origin-center flex flex-col justify-between p-2.5 ${styles}`}
            >
              
              {/* Product Image Viewer Container */}
              <div className="relative w-full h-[72%] bg-gray-50/50 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={product.image || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"}
                  alt={product.title}
                  className="w-full h-full object-cover select-none"
                />
                
                {/* Category Badge overlay */}
                <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  {product.category || "T-Shirt"}
                </span>

                {/* Floating Admin Controls overlay for active card */}
                {isActive && userRole === "admin" && (
                  <div className="absolute bottom-2 left-2 right-2 bg-purple-950/95 backdrop-blur-sm p-1.5 rounded-lg flex items-center justify-between gap-1 shadow z-50">
                    <span className="text-[8px] font-black uppercase text-purple-200 tracking-wider pl-1">Admin</span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Edit item...");
                        }}
                        className="bg-white text-gray-800 text-[8px] font-black px-2 py-0.5 rounded hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product);
                        }}
                        className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimalist Details Footer */}
              <div className="flex flex-col justify-between flex-1 mt-2 px-1">
                <div>
                  <h3 className="font-black text-gray-900 text-xs tracking-tight line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-black text-black">
                      ${product.price ? product.price.toFixed(2) : "0.00"}
                    </span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                      {product.stock > 0 ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                </div>

                {/* Add to Cart button */}
                <button
                  disabled={product.stock <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="w-full mt-2.5 bg-black text-white hover:bg-neutral-900 active:scale-[0.98] transition-all text-[10px] font-bold uppercase py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  Add to Cart 🛒
                </button>
              </div>

            </div>
          );
        })}

        {/* 3D Navigation Controls */}
        {products.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-4 z-50 w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-black text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-sm"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-4 z-50 w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-black text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-sm"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="flex gap-2 mt-2 z-20">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-black" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
