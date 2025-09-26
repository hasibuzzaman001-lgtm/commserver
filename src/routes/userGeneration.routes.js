import { Router } from "express";
import { generatePlatformUsers } from "../controllers/userGeneration.controller.js";

const router = Router();

router.route("/").post(generatePlatformUsers);

export default router;
