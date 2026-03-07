import { Router } from 'express';
import { 
  createTransaction, 
  getTransactions, 
  updateTransaction, 
  deleteTransaction, 
  getTransactionsByCategory
} from '../controllers/transactionController';
import authenticate from '../middlewares/authenticate';
import { getBalance } from '../controllers/balanceController';

const router = Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getTransactions);
router.put('/:id', authenticate, updateTransaction);
router.delete('/:id', authenticate, deleteTransaction);
router.get('/category', authenticate, getTransactionsByCategory);

router.get('/balance', authenticate, getBalance);

export default router;
