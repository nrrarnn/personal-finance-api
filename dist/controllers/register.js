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
exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        let user = yield userModel_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        user = new userModel_1.default({ username, email, password });
        yield user.save();
        const defaultCategories = [
            { name: 'Food', icon: '🍔', type: 'expense' },
            { name: 'Transport', icon: '🚗', type: 'expense' },
            { name: 'Bills', icon: '💡', type: 'expense' },
            { name: 'Shopping', icon: '🛍️', type: 'expense' },
            { name: 'Health', icon: '🩺', type: 'expense' },
            { name: 'Education', icon: '🎓', type: 'expense' },
            { name: 'Groceries', icon: '🛒', type: 'expense' },
            { name: 'Entertainment', icon: '🎭', type: 'expense' },
            { name: 'Rent', icon: '🏠', type: 'expense' },
            { name: 'Salary', icon: '💼', type: 'income' },
            { name: 'Freelance', icon: '🖥️', type: 'income' },
            { name: 'Investments', icon: '📈', type: 'income' }
        ];
        for (const { name, icon, type } of defaultCategories) {
            try {
                const category = new categoryModel_1.default({
                    name,
                    icon,
                    type,
                    userId: user._id
                });
                yield category.save();
            }
            catch (error) {
                console.error(`Error creating category ${name}:`, error);
            }
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
