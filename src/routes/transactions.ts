import { Router } from 'express';
import { getBalance } from '../controllers/balance';
import { getCategories, addCategory, deleteCategory } from '../controllers/category';
import { addExpense, getExpenses, deleteExpense, getExpensesByCategory, updateExpense } from '../controllers/expense';
import { addIncome, deleteIncome, getIncomes, getIncomesByCategory, updateIncome } from '../controllers/income';
import authenticate from '../middlewares/authenticate';

const router = Router();

router.post('/income', authenticate, addIncome)
  .get('/incomes', authenticate, getIncomes)
  .delete('/income/:id', authenticate, deleteIncome)
  .put('/income/:id', authenticate, updateIncome)
  .get('/incomes/:category', authenticate, getIncomesByCategory)
  .post('/expense', authenticate, addExpense)
  .get('/expenses', authenticate, getExpenses)
  .delete('/expense/:id', authenticate, deleteExpense)
  .put('/expense/:id', authenticate, updateExpense)
  .get('/expenses/:category', authenticate, getExpensesByCategory)
  .get('/balance', authenticate, getBalance)
  .get('/categories', authenticate, getCategories)
  .post('/category', authenticate, addCategory)
  .delete('/category/:id', authenticate, deleteCategory);

export default router;