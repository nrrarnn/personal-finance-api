import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import { getCategories, addCategory, deleteCategory, updateCategory } from '../controllers/categoryController';

const router = Router();

router.get('/', authenticate, getCategories);
router.post('/', authenticate, addCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;