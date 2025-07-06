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
exports.deleteCategory = exports.getCategories = exports.addCategory = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, icon, type } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }
    if (!name) {
        res.status(400).json({ message: "Category name is required" });
        return;
    }
    try {
        const category = new categoryModel_1.default({
            name,
            icon,
            type,
            userId,
        });
        yield category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
});
exports.addCategory = addCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const categories = yield categoryModel_1.default.find({ userId });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
});
exports.getCategories = getCategories;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }
    try {
        const category = yield categoryModel_1.default.findOne({ _id: id, userId });
        if (!category) {
            res.status(404).json({ message: 'Category not found or unauthorized' });
            return;
        }
        yield categoryModel_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Category Deleted' });
    }
    catch (_b) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.deleteCategory = deleteCategory;
