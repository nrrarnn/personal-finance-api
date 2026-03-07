import express from "express";
import pocketRoutes from "./pocketRoutes";
import transactionRoutes from "./transactionRoutes";
import statsRoutes from "./statsRoutes";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/pockets", pocketRoutes);
router.use("/transactions", transactionRoutes);
router.use("/stats", statsRoutes);
router.use("/category", categoryRoutes);

export default router;