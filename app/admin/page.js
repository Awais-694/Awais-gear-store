// app/admin/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    category: "T-Shirt",
    stock: "15",
    isNewProduct: false,
  });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const router = useRouter();

  const handleSizeChange = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleColorChange = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductUpload = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: "", text: "" });

    if (!imageFile) {
      setStatusMsg({ type: "error", text: "Bhai, product image upload karna zaroori hai!" });
      setSaving(false);
      return;
    }

    try {
      // 1. Upload File to Cloudinary via server API
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        setStatusMsg({ type: "error", text: `Image Upload Error: ${uploadData.message}` });
        setSaving(false);
        return;
      }

      // 2. Submit product details to MongoDB
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          image: uploadData.url,
          sizes: selectedSizes,
          colors: selectedColors,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMsg({ type: "success", text: "🚀 Product successfully created and uploaded!" });
        
        // Reset states
        setProductData({ title: "", description: "", price: "", category: "T-Shirt", stock: "15", isNewProduct: false });
        setSelectedSizes([]);
        setSelectedColors([]);
        setImageFile(null);
        setImagePreview("");
        
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setStatusMsg({ type: "error", text: `Access Error: ${data.message}` });
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Inventory sync stream communication failure!" });
    } finally {
      setSaving(false);
    }
  };

  const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL"];
  const colorOptions = [
    "Black", "White", "Grey", "Blue", "Red", 
    "Green", "Yellow", "Orange", "Pink", "Purple", 
    "Brown", "Navy", "Beige", "Olive", "Maroon"
  ];
  const colorMap = {
    Black: "#111827",
    White: "#FFFFFF",
    Grey: "#6B7280",
    Blue: "#3B82F6",
    Red: "#EF4444",
    Green: "#10B981",
    Yellow: "#FBBF24",
    Orange: "#F97316",
    Pink: "#EC4899",
    Purple: "#8B5CF6",
    Brown: "#78350F",
    Navy: "#1E3A8A",
    Beige: "#F5F5DC",
    Olive: "#808000",
    Maroon: "#800000"
  };
  const categoryOptions = ["T-Shirt", "Shirt", "Jeans", "Jackets", "Caps"];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      
      {/* 🌟 Elegant Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-neutral-800 to-gray-900 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full text-blue-300">
            Store Controller Panel
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Upload Premium Merchandise</h1>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl font-medium">
            Publish new arrivals, specify sizes/colors parameters, and sync stock availability in real time.
          </p>
        </div>
      </div>

      {/* Styled inline notification alert box */}
      {statusMsg.text && (
        <div className={`p-5 rounded-2xl text-xs font-semibold border flex items-center gap-3 animate-fadeIn transition-all duration-300 shadow-sm ${
          statusMsg.type === "success" 
            ? "bg-emerald-50 text-emerald-900 border-emerald-100" 
            : "bg-red-50 text-red-900 border-red-100"
        }`}>
          <span className="text-lg select-none font-bold">
            {statusMsg.type === "success" ? "✓" : "⚠"}
          </span>
          <p>{statusMsg.text}</p>
        </div>
      )}

      {/* 📦 Main Two-Column Design Form */}
      <form onSubmit={handleProductUpload} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Assets & Metadata selection */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Media Upload Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider">Product Visuals</h3>
            
            <div className="relative group border-2 border-dashed border-gray-200 hover:border-black rounded-2xl p-6 transition-all bg-gray-50/50 hover:bg-white text-center cursor-pointer flex flex-col items-center justify-center min-h-[220px]">
              <input
                type="file"
                required={!imagePreview}
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview ? (
                <div className="relative z-0 space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-40 object-cover rounded-xl shadow-md border mx-auto"
                  />
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Click or Drag to replace image</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mx-auto text-gray-400 group-hover:text-black transition-colors">
                    📸
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">Choose product image</p>
                    <p className="text-[10px] text-gray-400 mt-1">Supports PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sizes Selection Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider">Available Sizes</h3>
              <span className="text-[10px] text-gray-400 font-bold">{selectedSizes.length} Selected</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sizeOptions.map((size) => {
                const isChecked = selectedSizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`py-3 border rounded-xl text-xs font-bold uppercase transition-all duration-150 ${
                      isChecked
                        ? "bg-black border-black text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-black hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors Selection Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider">Available Colors</h3>
              <span className="text-[10px] text-gray-400 font-bold">{selectedColors.length} Selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => {
                const isChecked = selectedColors.includes(color);
                return (
                  <button
                    type="button"
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-[11px] font-bold transition-all duration-150 ${
                      isChecked
                        ? "bg-black border-black text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span 
                      className={`w-3.5 h-3.5 rounded-full border border-black/10 shrink-0`} 
                      style={{ backgroundColor: colorMap[color] }}
                    />
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Text Information fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider border-b pb-3 border-gray-100">Product Specifications</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Title input */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Slim Fit Custom Developer Hoodie"
                  value={productData.title}
                  onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                  className="w-full border border-gray-200 p-3.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Category</label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                  className="w-full border border-gray-200 p-3.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all bg-white"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Value */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Price Value ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="29.99"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="w-full border border-gray-200 p-3.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                />
              </div>

              {/* Stock Count */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Stock Availability Count</label>
                <input
                  type="number"
                  required
                  placeholder="15"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  className="w-full border border-gray-200 p-3.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                />
              </div>

              {/* New Arrival Checkbox */}
              <div className="flex items-center pl-1 h-full pt-4 sm:pt-6">
                <label className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productData.isNewProduct}
                    onChange={(e) => setProductData({ ...productData, isNewProduct: e.target.checked })}
                    className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                  />
                  <span>Mark as New Arrival 🌟</span>
                </label>
              </div>

              {/* Description Textarea */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Description Context</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Describe materials metrics, comfort elements, and technical specifications of this item..."
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  className="w-full border border-gray-200 p-3.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all leading-relaxed"
                />
              </div>

            </div>

            {/* Submit Action Block */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-gray-900 to-black text-white font-extrabold text-xs px-8 py-4 rounded-xl uppercase tracking-wider hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-md"
              >
                {saving ? "Uploading Image & Synchronizing..." : "Publish Item Live 🚀"}
              </button>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}