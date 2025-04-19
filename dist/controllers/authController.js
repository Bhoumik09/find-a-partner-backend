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
exports.forgotPass = exports.signUp = exports.login = exports.fetchUserName = exports.fetchUser = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../config/logger"));
const prisma_1 = require("../config/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const key = process.env.SECRET_KEY;
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const userInfo = yield prisma_1.prisma.user.findUnique({
            where: {
                id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            select: {
                id: true,
                phoneNumber: true,
                name: true,
                gender: true,
            },
        });
        if (!userInfo) {
            res.status(404).json({
                error: "User not found ",
            });
            return;
        }
        res
            .status(200)
            .json({ msg: "User Logged In Successfully", userInfo: userInfo });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in fetching  User Info", {
                email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
                error: error.message,
            });
            res.status(500).json({
                error: "Server error Occured",
            });
            return;
        }
        else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2028") {
                console.error("⚠️ Transaction Timeout: The query took too long.");
                logger_1.default.error("Transaction Timeout", {
                    email: (_c = req.body) === null || _c === void 0 ? void 0 : _c.email,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Transaction took too long and was aborted. Please try again.",
                });
                return;
            }
            else {
                console.error(`🔴 Prisma Error (${error.code}):`, error.message);
                logger_1.default.error("Prisma error", {
                    email: (_d = req.body) === null || _d === void 0 ? void 0 : _d.email,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Something went wrong. Try again ",
                });
                return;
            }
            // Prisma's timeout error code
        }
        logger_1.default.error("Error occurred in fetching user details", {
            email: (_e = req.body) === null || _e === void 0 ? void 0 : _e.email,
            error: error,
        });
        res.status(500).json({ error: "An error occurred during login." });
    }
});
exports.fetchUser = fetchUser;
const fetchUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const userInfo = yield prisma_1.prisma.user.findUnique({
            where: {
                id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            select: {
                name: true,
                id: true,
            },
        });
        if (!userInfo) {
            res.status(404).json({
                error: "User not found ",
            });
            return;
        }
        res
            .status(200)
            .json({ msg: "User Logged In Successfully", userInfo: userInfo });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in fetching  User Info", {
                email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
                error: error.message,
            });
            res.status(500).json({
                error: "Server error Occured",
            });
            return;
        }
        else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2028") {
                console.error("⚠️ Transaction Timeout: The query took too long.");
                logger_1.default.error("Transaction Timeout", {
                    email: (_c = req.body) === null || _c === void 0 ? void 0 : _c.email,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Transaction took too long and was aborted. Please try again.",
                });
                return;
            }
            else {
                console.error(`🔴 Prisma Error (${error.code}):`, error.message);
                logger_1.default.error("Prisma error", {
                    email: (_d = req.body) === null || _d === void 0 ? void 0 : _d.email,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Something went wrong. Try again ",
                });
                return;
            }
            // Prisma's timeout error code
        }
        logger_1.default.error("Error occurred in fetching user details", {
            email: (_e = req.body) === null || _e === void 0 ? void 0 : _e.email,
            error: error,
        });
        res.status(500).json({ error: "An error occurred during login." });
    }
});
exports.fetchUserName = fetchUserName;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const { username, phoneNumber, password } = req.body;
    try {
        const findUser = yield prisma_1.prisma.user.findUnique({
            where: {
                name_phoneNumber: {
                    name: username,
                    phoneNumber,
                },
            },
            select: {
                id: true,
                password: true,
            },
        });
        if (!findUser) {
            res.status(404).json({
                error: "Either the username or phoneNumber provided is incorrect ",
            });
            return;
        }
        const passwordMatches = bcryptjs_1.default.compareSync(password, findUser.password);
        if (!passwordMatches) {
            res.status(404).json({ error: "The password provided is Incorrect" });
            return;
        }
        const payload = {
            id: findUser.id,
        };
        const token = jsonwebtoken_1.default.sign(payload, key, {
            expiresIn: "7h",
        });
        res.status(200).json({ msg: "User Logged In Successfully", token });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in login in the User", {
                username: (_a = req.body) === null || _a === void 0 ? void 0 : _a.username,
                phoneNumber: (_b = req.body) === null || _b === void 0 ? void 0 : _b.phoneNumber,
                error: error.message,
            });
            res.status(500).json({
                error: "Server error Occured",
            });
            return;
        }
        else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2028") {
                console.error("⚠️ Transaction Timeout: The query took too long.");
                logger_1.default.error("Transaction Timeout", {
                    username: (_c = req.body) === null || _c === void 0 ? void 0 : _c.username,
                    phoneNumber: (_d = req.body) === null || _d === void 0 ? void 0 : _d.phoneNumber,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Transaction took too long and was aborted. Please try again.",
                });
                return;
            }
            else {
                console.error(`🔴 Prisma Error (${error.code}):`, error.message);
                logger_1.default.error("Prisma error", {
                    username: (_e = req.body) === null || _e === void 0 ? void 0 : _e.username,
                    phoneNumber: (_f = req.body) === null || _f === void 0 ? void 0 : _f.phoneNumber,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Something went wrong. Try again ",
                });
                return;
            }
            // Prisma's timeout error code
        }
        logger_1.default.error("Error occurred in creating User", {
            email: (_g = req.body) === null || _g === void 0 ? void 0 : _g.email,
            error: error,
        });
        res.status(500).json({ error: "An error occurred during login." });
    }
});
exports.login = login;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { username, email, gender, phoneNumber, password } = req.body;
    try {
        const checkDuplicateNumber = yield prisma_1.prisma.user.findUnique({
            where: {
                name_phoneNumber: {
                    name: username,
                    phoneNumber: phoneNumber,
                },
            },
            select: {
                id: true,
            },
        });
        if (checkDuplicateNumber) {
            res.status(404).json({
                error: "Either the phone number or username provided is already registered",
            });
            logger_1.default.warn("Both username and phone number are alreaddy registered", {
                email,
                phoneNumber,
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield prisma_1.prisma.user.create({
            data: {
                name: username,
                email,
                gender,
                password: hashedPassword,
                phoneNumber,
            },
        });
        res.status(200).json({ msg: "User is successfully registered" });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in creating User", {
                username: (_a = req.body) === null || _a === void 0 ? void 0 : _a.username,
                phoneNumber: (_b = req.body) === null || _b === void 0 ? void 0 : _b.phoneNumber,
                error: error.message,
            });
            res.status(500).json({
                error: "Server error Occured",
            });
            return;
        }
        else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2028") {
                console.error("⚠️ Transaction Timeout: The query took too long.");
                logger_1.default.error("Transaction Timeout", {
                    username: (_c = req.body) === null || _c === void 0 ? void 0 : _c.username,
                    phoneNumber: (_d = req.body) === null || _d === void 0 ? void 0 : _d.phoneNumber,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Transaction took too long and was aborted. Please try again.",
                });
                return;
            }
            else {
                console.error(`🔴 Prisma Error (${error.code}):`, error.message);
                logger_1.default.error("Prisma error", {
                    username: (_e = req.body) === null || _e === void 0 ? void 0 : _e.username,
                    phoneNumber: (_f = req.body) === null || _f === void 0 ? void 0 : _f.phoneNumber,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Something went wrong. Try again ",
                });
                return;
            }
            // Prisma's timeout error code
        }
        logger_1.default.error("Error occurred in creating User", {
            username: (_g = req.body) === null || _g === void 0 ? void 0 : _g.username,
            phoneNumber: (_h = req.body) === null || _h === void 0 ? void 0 : _h.phoneNumber,
            error: error,
        });
        res.status(500).json({ error: "An error occurred during signup." });
    }
});
exports.signUp = signUp;
const forgotPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { username, phoneNumber, password: currentPassword } = req.body;
    try {
        const checkId = yield prisma_1.prisma.user.findUnique({
            where: {
                name_phoneNumber: {
                    name: username,
                    phoneNumber: phoneNumber,
                },
            },
            select: {
                id: true,
            },
        });
        if (!checkId) {
            res.status(404).json({
                error: "The phone number and username provided is not registered",
            });
            logger_1.default.warn("Both username and phone number are not registered", {
                phoneNumber,
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(currentPassword, 10);
        yield prisma_1.prisma.user.update({
            where: {
                name_phoneNumber: {
                    name: username,
                    phoneNumber
                }
            },
            data: {
                password: hashedPassword,
            },
        });
        res.status(200).json({ msg: "Password is successfully Updated" });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in creating User", {
                username: (_a = req.body) === null || _a === void 0 ? void 0 : _a.username,
                phoneNumber: (_b = req.body) === null || _b === void 0 ? void 0 : _b.phoneNumber,
                error: error.message,
            });
            res.status(500).json({
                error: "Server error Occured",
            });
            return;
        }
        else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2028") {
                console.error("⚠️ Transaction Timeout: The query took too long.");
                logger_1.default.error("Transaction Timeout", {
                    username: (_c = req.body) === null || _c === void 0 ? void 0 : _c.username,
                    phoneNumber: (_d = req.body) === null || _d === void 0 ? void 0 : _d.phoneNumber,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Transaction took too long and was aborted. Please try again.",
                });
                return;
            }
            else {
                console.error(`🔴 Prisma Error (${error.code}):`, error.message);
                logger_1.default.error("Prisma error", {
                    username: (_e = req.body) === null || _e === void 0 ? void 0 : _e.username,
                    phoneNumber: (_f = req.body) === null || _f === void 0 ? void 0 : _f.phoneNumber,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Something went wrong. Try again ",
                });
                return;
            }
            // Prisma's timeout error code
        }
        logger_1.default.error("Error occurred in creating User", {
            username: (_g = req.body) === null || _g === void 0 ? void 0 : _g.username,
            phoneNumber: (_h = req.body) === null || _h === void 0 ? void 0 : _h.phoneNumber,
            error: error,
        });
        res.status(500).json({ error: "An error occurred during signup." });
    }
});
exports.forgotPass = forgotPass;
