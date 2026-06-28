"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import Product3DCarousel from "./Product3DCarousel";

export default function ProductsCatalog({ initialProducts, userRole }) {
  const searchParams = useSearchParams();
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterNew, setFilterNew] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [availability, setAvailability] = useState({
    inStock: true,
    outOfStock: true,
  });
  
  // Listen to searchParams changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const filterParam = searchParams.get("filter");

    if (categoryParam) {
      if (categoryParam === "Collections") {
        setSelectedCategory("All");
      } else {
        setSelectedCategory(categoryParam);
      }
    } else {
      setSelectedCategory("All");
    }

    if (filterParam === "new") {
      setFilterNew(true);
    } else {
      setFilterNew(false);
    }
  }, [searchParams]);

  // Accordion toggle states
  const [accordions, setAccordions] = useState({
    category: true,
    colors: true,
    priceRange: true,
    collections: true,
    tags: true,
  });

  const toggleAccordion = (key) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock sizes list
  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  const colors = [
    "Black", "White", "Grey", "Blue", "Red", 
    "Green", "Yellow", "Orange", "Pink", "Purple", 
    "Brown", "Navy", "Beige", "Olive", "Maroon"
  ];

  // Mock categories list
  const categories = ["All", "T-Shirt", "Shirt", "Jeans", "Jackets", "Caps"];

  // Toggle size selection
  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Toggle color selection
  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Search Query filter
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category filter
      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      // 3. Availability filter
      const isAvailable = product.stock > 0;
      const matchesAvailability =
        (availability.inStock && isAvailable) ||
        (availability.outOfStock && !isAvailable);

      // 4. Size Filter (database check)
      let matchesSize = true;
      if (selectedSizes.length > 0) {
        matchesSize = product.sizes && product.sizes.some((size) => selectedSizes.includes(size));
      }

      // 5. Color Filter (database check)
      let matchesColor = true;
      if (selectedColors.length > 0) {
        matchesColor = product.colors && product.colors.some((color) => selectedColors.includes(color));
      }

      // 6. New Arrivals Filter (database check)
      const matchesNew = !filterNew || product.isNewProduct === true;

      return matchesSearch && matchesCategory && matchesAvailability && matchesSize && matchesColor && matchesNew;
    });
  }, [initialProducts, searchQuery, selectedCategory, selectedSizes, selectedColors, availability, filterNew]);

  const tShirts = useMemo(() => {
    return filteredProducts.filter((p) => p.category?.toLowerCase() === "t-shirt");
  }, [filteredProducts]);

  const caps = useMemo(() => {
    return filteredProducts.filter((p) => p.category?.toLowerCase() === "caps");
  }, [filteredProducts]);

  const otherProducts = useMemo(() => {
    return filteredProducts.filter(
      (p) => p.category?.toLowerCase() !== "t-shirt" && p.category?.toLowerCase() !== "caps"
    );
  }, [filteredProducts]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* 🌪️ LEFT FILTER SIDEBAR */}
      <aside className="w-full lg:w-64 shrink-0 space-y-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-black mb-4">Filters</h3>
          
          {/* Size Filter */}
          <div className="border-t border-gray-150 py-4">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide block mb-3">Size</span>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`h-9 border text-xs font-bold rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="border-t border-gray-150 py-4">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide block mb-3">Availability</span>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-xs font-bold text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.inStock}
                  onChange={(e) =>
                    setAvailability({ ...availability, inStock: e.target.checked })
                  }
                  className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                />
                In Stock ({initialProducts.filter((p) => p.stock > 0).length})
              </label>
              <label className="flex items-center gap-2.5 text-xs font-bold text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.outOfStock}
                  onChange={(e) =>
                    setAvailability({ ...availability, outOfStock: e.target.checked })
                  }
                  className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                />
                Out Of Stock ({initialProducts.filter((p) => p.stock <= 0).length})
              </label>
            </div>
          </div>

          {/* Category Accordion */}
          <div className="border-t border-gray-150 py-4">
            <button
              onClick={() => toggleAccordion("category")}
              className="w-full flex justify-between items-center text-xs font-bold text-gray-900 uppercase tracking-wide text-left"
            >
              Category
              <span>{accordions.category ? "−" : "+"}</span>
            </button>
            {accordions.category && (
              <div className="mt-3 space-y-2 pl-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block text-xs font-bold text-left transition ${
                      selectedCategory === cat ? "text-black underline" : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colors Accordion */}
          <div className="border-t border-gray-150 py-4">
            <button
              onClick={() => toggleAccordion("colors")}
              className="w-full flex justify-between items-center text-xs font-bold text-gray-900 uppercase tracking-wide text-left"
            >
              Colors
              <span>{accordions.colors ? "−" : "+"}</span>
            </button>
            {accordions.colors && (
              <div className="mt-3 flex flex-wrap gap-2 pl-1">
                {colors.map((color) => {
                  const isSelected = selectedColors.includes(color);
                  const colorBgClass = {
                    Black: "bg-black",
                    White: "bg-white border-gray-300",
                    Grey: "bg-gray-400",
                    Blue: "bg-blue-600",
                    Red: "bg-red-500",
                    Green: "bg-green-600",
                    Yellow: "bg-yellow-400",
                    Orange: "bg-orange-500",
                    Pink: "bg-pink-400",
                    Purple: "bg-purple-600",
                    Brown: "bg-amber-800",
                    Navy: "bg-blue-950",
                    Beige: "bg-[#F5F5DC]",
                    Olive: "bg-[#808000]",
                    Maroon: "bg-[#800000]",
                  }[color] || "bg-gray-100";

                  return (
                    <button
                      key={color}
                      onClick={() => handleColorToggle(color)}
                      title={color}
                      className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-all ${colorBgClass} border ${
                        isSelected ? "ring-2 ring-black ring-offset-2 scale-110" : "border-gray-200"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Price Range Accordion */}
          <div className="border-t border-gray-150 py-4">
            <button
              onClick={() => toggleAccordion("priceRange")}
              className="w-full flex justify-between items-center text-xs font-bold text-gray-900 uppercase tracking-wide text-left"
            >
              Price Range
              <span>{accordions.priceRange ? "−" : "+"}</span>
            </button>
            {accordions.priceRange && (
              <div className="mt-3 text-xs font-bold text-gray-500 pl-1">
                $10.00 - $150.00
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT GRID & FILTERS */}
      <section className="flex-1 space-y-6">
        {/* Top Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Home / Products
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase mt-0.5">
              Products
            </h2>
          </div>

          {/* Search bar inside content layout */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-205 p-2.5 pl-9 rounded-xl text-xs font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            />
            <span className="absolute left-3.5 top-3.5 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Categories Pills Row */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none items-center">
          {filterNew && (
            <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-[10px] font-black px-3 py-2 rounded-xl uppercase tracking-wider border border-yellow-200">
              <span>🌟 New Arrivals</span>
              <button
                type="button"
                onClick={() => {
                  window.history.pushState(null, "", "/");
                  setFilterNew(false);
                }}
                className="hover:text-black font-bold ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
          {categories.map((cat) => {
            const isActive = selectedCategory === cat && !filterNew;
            return (
              <button
                key={cat}
                onClick={() => {
                  if (filterNew) {
                    window.history.pushState(null, "", `/?category=${cat}`);
                    setFilterNew(false);
                  }
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 shrink-0 ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "bg-gray-100/80 hover:bg-gray-200 text-gray-600 hover:text-black"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 📦 INVENTORY GRID / 3D CAROUSELS */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-3xl bg-white space-y-3">
            <p className="text-gray-400 font-bold text-sm">Filhal store par koi products filtered nahi hain.</p>
          </div>
        ) : (
          <>
            {/* 🖥️ Desktop Display: Grid View Only */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((tshirt) => (
                  <ProductCard
                    key={tshirt._id}
                    product={tshirt}
                    userRole={userRole}
                  />
                ))}
              </div>
            </div>

            {/* 📱 Mobile Display: Split into T-Shirts and Caps 3D Sliders */}
            <div className="block md:hidden space-y-12">
              {/* T-Shirts Slider Section */}
              {tShirts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black pl-1.5 flex items-center gap-2">
                    <span>👕 T-Shirts Collection</span>
                    <span className="text-[9px] bg-gray-150 text-gray-500 font-black px-2 py-0.5 rounded-full">{tShirts.length} items</span>
                  </h3>
                  <Product3DCarousel products={tShirts} userRole={userRole} />
                </div>
              )}

              {/* Caps Slider Section */}
              {caps.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black pl-1.5 flex items-center gap-2">
                    <span>🧢 Caps Collection</span>
                    <span className="text-[9px] bg-gray-150 text-gray-500 font-black px-2 py-0.5 rounded-full">{caps.length} items</span>
                  </h3>
                  <Product3DCarousel products={caps} userRole={userRole} />
                </div>
              )}

              {/* Other Items Section (Jeans, Jackets, Shirts if any) */}
              {otherProducts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black pl-1.5 flex items-center gap-2">
                    <span>📦 More Merchandise</span>
                    <span className="text-[9px] bg-gray-150 text-gray-500 font-black px-2 py-0.5 rounded-full">{otherProducts.length} items</span>
                  </h3>
                  <Product3DCarousel products={otherProducts} userRole={userRole} />
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
