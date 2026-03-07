import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import { getCategoryStats, getPieChartData, getStatsByUser } from '../controllers/statsController';

const router = Router();
router.get('/category', authenticate, getCategoryStats);
router.get('/pie-chart', authenticate, getPieChartData);
router.get('/user', authenticate, getStatsByUser);

export default router;