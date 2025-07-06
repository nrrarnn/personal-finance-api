"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const balance_1 = require("../controllers/balance");
const category_1 = require("../controllers/category");
const expense_1 = require("../controllers/expense");
const income_1 = require("../controllers/income");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = (0, express_1.Router)();
router.post('/income', authenticate_1.default, income_1.addIncome)
    .get('/incomes', authenticate_1.default, income_1.getIncomes)
    .delete('/income/:id', authenticate_1.default, income_1.deleteIncome)
    .put('/income/:id', authenticate_1.default, income_1.updateIncome)
    .get('/incomes/:category', authenticate_1.default, income_1.getIncomesByCategory)
    .post('/expense', authenticate_1.default, expense_1.addExpense)
    .get('/expenses', authenticate_1.default, expense_1.getExpenses)
    .delete('/expense/:id', authenticate_1.default, expense_1.deleteExpense)
    .put('/expense/:id', authenticate_1.default, expense_1.updateExpense)
    .get('/expenses/:category', authenticate_1.default, expense_1.getExpensesByCategory)
    .get('/balance', authenticate_1.default, balance_1.getBalance)
    .get('/categories', authenticate_1.default, category_1.getCategories)
    .post('/category', authenticate_1.default, category_1.addCategory)
    .delete('/category/:id', authenticate_1.default, category_1.deleteCategory);
exports.default = router;
