import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  location: String,
  locationLink: String,
  description: String,
  
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
