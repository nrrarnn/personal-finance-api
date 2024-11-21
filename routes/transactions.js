const { getBalance } = require('../controllers/balance')
const { getCategories, addCategory, deleteCategory } = require('../controllers/category')
const { addExpense, getExpenses, deleteExpense, getExpensesByCategory, updateExpense } = require('../controllers/expense')
const { addIncome, getIncomes, deleteIncome, getIncomesByCategory, updateIncome } = require('../controllers/income')
const authenticate = require('../middlewares/authenticate')

const router = require('express').Router()

router.post('/income', authenticate, addIncome)
.get('/incomes', authenticate, getIncomes)
.delete('/income/:id',authenticate, deleteIncome)
.put('/income/:id', authenticate, updateIncome)
.get('/incomes/:category',authenticate, getIncomesByCategory)
.post('/expense',authenticate, addExpense)
.get('/expenses', authenticate, getExpenses)
.delete('/expense/:id',authenticate, deleteExpense)
.put('/expense/:id', authenticate, updateExpense)
.get('/expenses/:category', authenticate, getExpensesByCategory)
.get('/balance', authenticate, getBalance)
.get('/categories', authenticate, getCategories)
.post('/category', authenticate, addCategory)
.delete('/category/:id', authenticate, deleteCategory)

module.exports = router