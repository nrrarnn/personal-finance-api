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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, db_1.default)()) {
            yield (0, db_1.default)();
            console.log('Database connected successfully');
        }
        next();
    }
    catch (error) {
        console.error('Failed to connect to database:', error.message);
        res.status(500).json({ message: 'Database connection error' });
    }
}));
(0, fs_1.readdirSync)(path_1.default.join(__dirname, 'routes')).forEach((route) => {
    try {
        const routePath = path_1.default.join(__dirname, 'routes', route);
        const importedRoute = require(routePath);
        app.use('/api/v1', importedRoute.default || importedRoute);
    }
    catch (error) {
        console.error(`Failed to load route ${route}:`, error.message);
    }
});
app.get('/', (req, res) => {
    res.send('Welcome to the API Personal Finance');
});
exports.default = app;
