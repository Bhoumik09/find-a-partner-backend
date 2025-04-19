"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const key = process.env.SECRET_KEY;
// Middleware to verify JWT and attach user info to req
const authenticateUser = (req, res, next) => {
    var _a;
    // Extract token from Authorization header
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Assuming Bearer token
    if (!token) {
        res.status(403).json({ error: "No token provided" });
        return;
    }
    // Verify token
    jsonwebtoken_1.default.verify(token, key, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        // Attach the user info to req
        req.user = { id: decoded.id };
        // Move to the next middleware/route handler
        next();
    });
};
exports.authenticateUser = authenticateUser;
