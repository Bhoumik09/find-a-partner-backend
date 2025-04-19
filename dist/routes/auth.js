"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
const zodMiddleware_1 = require("../middleware/zodMiddleware");
const auth_1 = require("../models/auth");
const middleware_1 = require("../middleware/middleware");
const authController_1 = require("../controllers/authController");
authRouter.post("/signup", (0, zodMiddleware_1.validateRequest)(auth_1.signUpSchema), authController_1.signUp);
authRouter.post("/login", (0, zodMiddleware_1.validateRequest)(auth_1.loginInSchema), authController_1.login);
authRouter.put("/forgot-pass", (0, zodMiddleware_1.validateRequest)(auth_1.loginInSchema), authController_1.forgotPass);
authRouter.get("/fetch-user", middleware_1.authenticateUser, authController_1.fetchUser);
authRouter.get("/fetch-user-name", middleware_1.authenticateUser, authController_1.fetchUserName);
exports.default = authRouter;
