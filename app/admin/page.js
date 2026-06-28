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
      setStatusMsg({ type: "error", text: "Aap ne product image upload nahi ki!" });
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
  const categoryOptions = ["T-Shirt", "Shirt", "Jeans", "Jackets", "Caps"];

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      
      {/* 📋 Section 2: Form Uploading Configuration Layer Interface */}
      <section id="upload-section" className="border border-gray-100 bg-white p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Upload New Store Item</h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Fill inventory metadata parameters structure. Items reflect real-time on home node grid.</p>
        </div>

        {/* Styled inline notification alert box */}
        {statusMsg.text && (
          <div className={`p-4 rounded-2xl text-xs font-semibold border flex items-center gap-2.5 animate-fadeIn transition-all duration-300 ${
            statusMsg.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
              : "bg-red-50 text-red-800 border-red-100"
          }`}>
            <span className="text-base select-none font-bold">
              {statusMsg.type === "success" ? "✓" : "⚠"}
            </span>
            <p>{statusMsg.text}</p>
          </div>
        )}

        <form onSubmit={handleProductUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Title input */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Title Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Slim Fit Casual Shirt"
              value={productData.title}
              onChange={(e) => setProductData({ ...productData, title: e.target.value })}
              className="w-full border p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Category</label>
            <select
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="w-full border p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black bg-white"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Value */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price Value ($ USD)</label>
            <input
              type="number"
              required
              placeholder="29.99"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              className="w-full border p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black"
            />
          </div>

          {/* Stock Count */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Availability Count</label>
            <input
              type="number"
              required
              placeholder="15"
              value={productData.stock}
              onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black"
            />
          </div>

          {/* New Arrival Checkbox */}
          <div className="flex items-center pl-1 h-full pt-6">
            <label className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase cursor-pointer select-none">
              <input
                type="checkbox"
                checked={productData.isNewProduct}
                onChange={(e) => setProductData({ ...productData, isNewProduct: e.target.checked })}
                className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
              />
              Mark as New Arrival 🌟
            </label>
          </div>

          {/* Image File Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Image File</label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black bg-white"
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-24 object-cover border rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Sizes Selection Checkboxes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Available Sizes</label>
            <div className="flex flex-wrap gap-3">
              {sizeOptions.map((size) => {
                const isChecked = selectedSizes.includes(size);
                return (
                  <label
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`px-3 py-2 border rounded-xl text-xs font-bold uppercase cursor-pointer select-none transition-all ${
                      isChecked
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-black"
                    }`}
                  >
                    {size}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Colors Selection Checkboxes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Available Colors</label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => {
                const isChecked = selectedColors.includes(color);
                return (
                  <label
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`px-3 py-2 border rounded-xl text-xs font-bold uppercase cursor-pointer select-none transition-all ${
                      isChecked
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-black"
                    }`}
                  >
                    {color}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Description Context</label>
            <textarea
              required
              rows="4"
              placeholder="Provide detailed material metrics specification info..."
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="w-full border p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-black/5 focus:border-black leading-relaxed"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-black text-white font-bold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {saving ? "Uploading Image & Synchronizing..." : "Publish Item Live 🚀"}
            </button>
          </div>
        </form>
      </section>

    </div>
  );
}