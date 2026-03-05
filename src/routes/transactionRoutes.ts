import { Router } from 'express';
import { 
  createTransaction, 
  getTransactions, 
  updateTransaction, 
  deleteTransaction, 
  getTransactionsByCategory
} from '../controllers/transactionController';
import { getCategories, addCategory, deleteCategory, updateCategory } from '../controllers/categoryController';
import authenticate from '../middlewares/authenticate';
import { getBalance } from '../controllers/balanceController';
import { getCategoryStats, getPieChartData, getStatsByUser } from '../controllers/statsController';

const router = Router();

router.get('/stats/category', authenticate, getCategoryStats);
router.get('/stats/pie-chart', authenticate, getPieChartData);
router.get('/stats/user', authenticate, getStatsByUser);

router.post('/transactions', authenticate, createTransaction);
router.get('/transactions', authenticate, getTransactions);
router.put('/transactions/:id', authenticate, updateTransaction);
router.delete('/transactions/:id', authenticate, deleteTransaction);
router.get('/transactions/category/:categoryId', authenticate, getTransactionsByCategory);

router.get('/categories', authenticate, getCategories);
router.post('/category', authenticate, addCategory);
router.put('/category/:id', authenticate, updateCategory);
router.delete('/category/:id', authenticate, deleteCategory);

router.get('/balance', authenticate, getBalance);

export default router;
