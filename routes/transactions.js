const { getBalance } = require('../controllers/balance')
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense')
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income')
const authenticate = require('../middlewares/authenticate')

const router = require('express').Router()

router.post('/income', authenticate, addIncome)
.get('/incomes', authenticate, getIncomes)
.delete('/income/:id',authenticate, deleteIncome)
.post('/expense',authenticate, addExpense)
.get('/expenses', authenticate, getExpenses)
.delete('/expense/:id',authenticate, deleteExpense)
.get('/balance', authenticate, getBalance)

module.exports = router