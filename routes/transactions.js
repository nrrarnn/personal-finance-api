const { getBalance } = require('../controllers/balance')
const { getCategories, addCategory, deleteCategory } = require('../controllers/category')
const { addExpense, getExpenses, deleteExpense, getExpensesByCategory } = require('../controllers/expense')
const { addIncome, getIncomes, deleteIncome, getIncomesByCategory } = require('../controllers/income')
const authenticate = require('../middlewares/authenticate')

const router = require('express').Router()

router.post('/income', authenticate, addIncome)
.get('/incomes', authenticate, getIncomes)
.delete('/income/:id',authenticate, deleteIncome)
.get('/incomes/:category',authenticate, getIncomesByCategory)
.post('/expense',authenticate, addExpense)
.get('/expenses', authenticate, getExpenses)
.delete('/expense/:id',authenticate, deleteExpense)
.get('/expenses/:category', authenticate, getExpensesByCategory)
.get('/balance', authenticate, getBalance)
.get('/categories', authenticate, getCategories)
.post('/category', authenticate, addCategory)
.delete('/category/:id', authenticate, deleteCategory)

module.exports = router