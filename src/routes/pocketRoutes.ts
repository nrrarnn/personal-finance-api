import express from "express";
import * as pocketController from "../controllers/pocketController";

const router = express.Router();

router.post("/", pocketController.createPocket);
router.get("/", pocketController.getPockets);
router.put("/:id", pocketController.updatePocket);
router.delete("/:id", pocketController.deletePocket);

export default router;