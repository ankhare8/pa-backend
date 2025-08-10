import express from "express";
import {
  createEvent,
  getEvents,
  getEventBySlug,
  getEventById,
  updateEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/:slug", getEventBySlug);
router.get("/id/:id", getEventById);

// TODO: only allow verified users to do this

router.get("/", getEvents);
// router.put("/:slug", updateEvent);

export default router;
