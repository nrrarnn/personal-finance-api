"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/login");
const register_1 = require("../controllers/register");
const router = (0, express_1.Router)();
router.post('/auth/register', register_1.register);
router.post('/auth/login', login_1.login);
exports.default = router;
