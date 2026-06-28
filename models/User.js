// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name zaroori hai!"] 
    },
    email: { 
      type: String, 
      required: [true, "Email zaroori hai!"], 
      unique: true,
      lowercase: true 
    },
    password: { 
      type: String, 
      required: [true, "Password zaroori hai!"] 
    },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" // New registration by default standard user hogi
    },
  },
  { timestamps: true } // Auto create createdAt aur updatedAt fields
);

// Agar model pehle se bana hua hai to woh use karein, nahi to naya banayein
export default mongoose.models.User || mongoose.model("User", UserSchema);