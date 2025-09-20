import express from "express";
import { getSoilData } from "../controllers/soilController.js";
const router = express.Router();





router.get("/", getSoilData);


export default router;
