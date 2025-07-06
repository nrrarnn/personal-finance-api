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
exports.getIncomesByCategory = exports.updateIncome = exports.deleteIncome = exports.getIncomes = exports.addIncome = void 0;
const incomeModel_1 = __importDefault(require("../models/incomeModel"));
const addIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, amount, category, description } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing' });
        return;
    }
    if (!title || !amount || !category || !description) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ message: 'Amount must be a positive number' });
        return;
    }
    try {
        const income = new incomeModel_1.default({ title, amount, category, description, userId });
        yield income.save();
        res.status(200).json({ message: 'Income added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addIncome = addIncome;
const getIncomes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomes = yield incomeModel_1.default.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getIncomes = getIncomes;
const deleteIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const income = yield incomeModel_1.default.findOne({ _id: id, userId: req.user.userId });
        if (!income) {
            res.status(404).json({ message: 'Income not found or unauthorized' });
            return;
        }
        yield incomeModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Income Deleted' });
    }
    catch (_a) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.deleteIncome = deleteIncome;
const updateIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { title, amount, category, description } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ message: 'User ID is missing' });
        return;
    }
    if (!title || !amount || !category || !description) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ message: 'Amount must be a positive number' });
        return;
    }
    try {
        const income = yield incomeModel_1.default.findOne({ _id: id, userId });
        if (!income) {
            res.status(404).json({ message: 'Income not found or unauthorized' });
            return;
        }
        income.title = title;
        income.amount = amount;
        income.category = category;
        income.description = description;
        yield income.save();
        res.status(200).json({ message: 'Income updated successfully', income });
    }
    catch (_b) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateIncome = updateIncome;
const getIncomesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    try {
        const incomes = yield incomeModel_1.default.find({ category, userId: req.user.userId });
        if (incomes.length === 0) {
            res.status(404).json({ message: 'No incomes found for this category' });
            return;
        }
        res.json(incomes);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching incomes by category', error });
    }
});
exports.getIncomesByCategory = getIncomesByCategory;
