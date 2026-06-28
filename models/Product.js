// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Product title zaroori hai!"],
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Product description zaroori hai!"] 
    },
    price: { 
      type: Number, 
      required: [true, "Price zaroori hai!"] 
    },
    image: { 
      type: String, 
      required: [true, "Cloudinary image URL zaroori hai!"] // Only string URL saved here
    },
    category: { 
      type: String, 
      default: "T-Shirt" 
    },
    sizes: {
      type: [String],
      default: []
    },
    colors: {
      type: [String],
      default: []
    },
    stock: { 
      type: Number, 
      required: [true, "Stock count zaroori hai!"],
      default: 10 
    },
    isNewProduct: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);