import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import rsvpRoutes from "./routes/rsvpRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/events", eventRoutes);

// Health check or root route (optional)
app.get("/", (req, res) => {
  res.send("RSVP backend running");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
