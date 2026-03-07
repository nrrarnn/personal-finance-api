import express from "express";
import authenticate from "../middlewares/authenticate";
import { createPocket, deletePocket, getPockets, updatePocket } from "../controllers/pocketController";

const router = express.Router();

router.post("/", authenticate, createPocket);
router.get("/", authenticate, getPockets);
router.put("/:id", authenticate, updatePocket);
router.delete("/:id", authenticate, deletePocket);

export default router;