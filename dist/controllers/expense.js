"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpensesByCategory = exports.updateExpense = exports.deleteExpense = exports.getExpenses = exports.addExpense = void 0;
const expenseModel_1 = __importDefault(require("../models/expenseModel"));
const addExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, amount, category, description } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }
    if (!title || !amount || !category || !description) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ message: "Amount must be a positive number" });
        return;
    }
    try {
        const expense = new expenseModel_1.default({ title, amount, category, description, userId });
        yield expense.save();
        res.status(200).json({ message: "Expense added successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.addExpense = addExpense;
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield expenseModel_1.default.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getExpenses = getExpenses;
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const expense = yield expenseModel_1.default.findOne({ _id: id, userId: req.user.userId });
        if (!expense) {
            res.status(404).json({ message: 'Expense not found or unauthorized' });
            return;
        }
        yield expenseModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Expense deleted' });
    }
    catch (_a) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteExpense = deleteExpense;
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { title, amount, category, description } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }
    if (!title || !amount || !category || !description) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ message: "Amount must be a positive number" });
        return;
    }
    try {
        const expense = yield expenseModel_1.default.findOne({ _id: id, userId });
        if (!expense) {
            res.status(404).json({ message: 'Expense not found or unauthorized' });
            return;
        }
        expense.title = title;
        expense.amount = amount;
        expense.category = category;
        expense.description = description;
        yield expense.save();
        res.status(200).json({ message: "Expense updated successfully", expense });
    }
    catch (_b) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateExpense = updateExpense;
const getExpensesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    try {
        const expenses = yield expenseModel_1.default.find({ category, userId: req.user.userId });
        if (expenses.length === 0) {
            res.status(404).json({ message: "No expenses found for this category" });
            return;
        }
        res.json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching expenses by category", error });
    }
});
exports.getExpensesByCategory = getExpensesByCategory;
