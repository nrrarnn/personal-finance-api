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
exports.getBalance = void 0;
const incomeModel_1 = __importDefault(require("../models/incomeModel"));
const expenseModel_1 = __importDefault(require("../models/expenseModel"));
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const [incomes, expenses] = yield Promise.all([
            incomeModel_1.default.find({ userId }),
            expenseModel_1.default.find({ userId }),
        ]);
        const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
        const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        const balance = totalIncome - totalExpense;
        res.status(200).json({ balance, totalIncome, totalExpense });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getBalance = getBalance;
