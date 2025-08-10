// backend/controllers/eventController.js
import Event from "../models/Event.js";


export const createEvent = async (req, res) => {
  try {
    const { name, slug, date, location, description } = req.body;

    if (!name || !slug || !date) {
      return res.status(400).json({ error: "Name, slug, and date are required" });
    }

    // Check slug uniqueness
    const existing = await Event.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: "Slug must be unique" });
    }

    const event = await Event.create({ name, slug, date, location, description });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Soonest first
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const event = await Event.findOne({ slug });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = req.body;

    const event = await Event.findOneAndUpdate({ slug }, updates, { new: true });
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Server error" });
  }
};
