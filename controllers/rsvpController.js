// backend/controllers/rsvpController.js
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import OTP from "../models/OTP.js";
import RSVP from "../models/RSVP.js";
import Event from "../models/Event.js"
import sendEmail from "../utils/sendEmail.js"


// Step 1: Request OTP
export const requestOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const otpCode = crypto.randomInt(1000, 9999).toString();

  await OTP.updateOne(
    { email },
    { $set: { otp: otpCode, expiresAt: Date.now() + 5 * 60 * 1000 } },
    { upsert: true }
  );

    // type, title, message
    await sendEmail(
      email,
      "Your Event OTP",
      `Your OTP is: ${otpCode}. Use this code to confirm your RSVP. This code will expire in 5 minutes.`
    );

    res.json({ message: "OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Step 2: Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await OTP.findOne({ email });

    if (!record) return res.status(400).json({ error: "No OTP found" });
    if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (Date.now() > record.expiresAt) return res.status(400).json({ error: "OTP expired" });

    // Check RSVP
    const existingRSVP = await RSVP.findOne({ email });

    if (existingRSVP) {
      return res.json({ status: "existing", rsvp: existingRSVP });
    } else {
      return res.json({ status: "new" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const submitRSVP = async (req, res) => {
  const { email, attending, guests, name, eventId } = req.body;
  if (!email || !eventId) return res.status(400).json({ error: "Email and eventId required" });

  // Optional: fetch event details for email
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  try {
    let rsvp = await RSVP.findOne({ email, eventId });

    if (!rsvp) {
      // Create new RSVP with editToken
      const editToken = uuidv4();
      rsvp = await RSVP.create({
        name,
        email,
        attending,
        guests,
        editToken,
        eventId,
        date: new Date(),
      });
    } else {
      // Update existing RSVP but keep editToken
      rsvp.name = name || rsvp.name;
      rsvp.attending = attending;
      rsvp.guests = guests;
      rsvp.date = new Date();
      await rsvp.save();
    }
    const editUrl = `${process.env.FRONTEND_URL}/edit/${rsvp.editToken}`;
    const emailText = `
        Hi ${rsvp.name || "Friend"},

        Thank you for RSVPing to ${event.name}!
        Event details:
        - Date: ${event.date.toDateString()}
        - Location: ${event.location || "TBA"}
        - Your response: ${rsvp.attending ? "Attending" : "Declined"}
        - Guests: ${rsvp.guests}

        You can modify your RSVP anytime here: ${editUrl}

        Best,
        ${process.env.EVENT_HOST_NAME || "Event Team"}
    `;

    await sendEmail(
      email,
      `Confirmation for ${event.name}`,
      emailText
    );


    res.json({ rsvp, message: "RSVP saved and confirmation email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch RSVP by edit token (include eventId for extra safety if desired)
export const getRSVPByToken = async (req, res) => {
  const { token } = req.params;

  try {
    const rsvp = await RSVP.findOne({ editToken: token }).populate("eventId");

    if (!rsvp) {
      return res.status(404).json({ error: "RSVP not found" });
    }

    res.json({
      name: rsvp.name,
      email: rsvp.email,
      attending: rsvp.attending,
      guests: rsvp.guests,
      event: rsvp.eventId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};