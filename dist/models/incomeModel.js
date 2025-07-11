"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IncomeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    amount: {
        type: Number,
        required: true,
        trim: true,
        max: 999999999999999,
    },
    type: {
        type: String,
        default: 'income',
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Income', IncomeSchema);
