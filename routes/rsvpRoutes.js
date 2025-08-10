// backend/routes/rsvpRoutes.js
import express from "express";
import {
  requestOTP,
  verifyOTP,
  submitRSVP,
  getRSVPByToken

} from "../controllers/rsvpController.js";

const router = express.Router();


router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/", submitRSVP);
router.get("/edit/:token", getRSVPByToken);


export default router;
