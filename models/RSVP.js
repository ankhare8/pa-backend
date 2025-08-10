// backend/models/RSVP.js
import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema({
   eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  name: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,          // each email only one RSVP
  },
  attending: {
    type: Boolean,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  editToken: {
    type: String,
    unique: true,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("RSVP", rsvpSchema);
