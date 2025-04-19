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
exports.deleteRide = exports.getAllRideOfUser = exports.getUserRide = exports.fetchRidesData = exports.updateRide = exports.createRide = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../config/logger"));
const prisma_1 = require("../config/prisma");
const createRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { source, destination, date, time, seats, vehicleName, price, number, genderPreference, additionalInfo, meetingPointArr, allowInAppChat, } = req.body;
    try {
        const userId = req.user.id;
        const userPhoneNumber = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { phoneNumber: true },
        });
        const ride = yield prisma_1.prisma.rides.create({
            data: {
                sourceId: source,
                destinationId: destination,
                date: new Date(date),
                time: new Date(time),
                numberOfSeats: Number(seats),
                vehicle: vehicleName,
                price,
                phoneNumber: number || userPhoneNumber.phoneNumber,
                genderPreference,
                additionalInfo,
                meetingPoints: meetingPointArr,
                allowInAppChat,
                userId: userId,
            },
        });
        res.status(200).json({ msg: "Ride is created successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in fetching  User Info", {
                email: (_a = req.body) === null || _a === void 0 ? void 0 : _a.email,
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
                    email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
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
                    email: (_c = req.body) === null || _c === void 0 ? void 0 : _c.email,
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
            email: (_d = req.body) === null || _d === void 0 ? void 0 : _d.email,
            error: error,
        });
        res.status(500).json({ error: "An error occurred during login." });
    }
});
exports.createRide = createRide;
const updateRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { source, destination, date, time, seats, vehicleName, price, number, genderPreference, additionalInfo, meetingPointArr, allowChat, } = req.body;
    try {
        const { rideId } = req.params;
        const userId = req.user.id;
        const userPhoneNumber = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { phoneNumber: true },
        });
        const updatedRide = yield prisma_1.prisma.rides.update({
            where: {
                id: rideId,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            data: {
                sourceId: source,
                destinationId: destination,
                date: date,
                time: time,
                numberOfSeats: Number(seats),
                vehicle: vehicleName,
                price: price,
                phoneNumber: number || userPhoneNumber.phoneNumber,
                genderPreference: genderPreference,
                additionalInfo: additionalInfo,
                meetingPoints: meetingPointArr,
                allowInAppChat: allowChat,
                userId: userId,
            },
        });
        console.log('updated rile');
        console.log(updatedRide);
        if (!updatedRide) {
            res.status(404).json({ msg: "Ride not found" });
            return;
        }
        res.status(200).json({ msg: "Ride is created successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in fetching  User Info", {
                email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
                error: error.message,
            });
            res.status(500).json({
                message: "Server error Occured",
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
        logger_1.default.error("Error occurred in updating ride details", {
            email: (_e = req.body) === null || _e === void 0 ? void 0 : _e.email,
            error: error,
        });
        res.status(500).json({ message: "An error occurred during login." });
    }
});
exports.updateRide = updateRide;
const fetchRidesData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { sourceId, destinationId, date, seats, genderPreference } = req.query;
        const ridesData = yield prisma_1.prisma.rides.findMany({
            where: {
                sourceId: sourceId ? Number(sourceId) : undefined,
                destinationId: destinationId ? Number(destinationId) : undefined,
                date: date ? new Date(date) : undefined,
                numberOfSeats: seats ? Number(seats) : undefined,
                genderPreference: genderPreference == 'both' ? 'both' : genderPreference
            },
            select: {
                user: {
                    select: {
                        id: true,
                        gender: true,
                        name: true,
                    },
                },
                id: true,
                destination: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                genderPreference: true,
                source: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                date: true,
                time: true,
                numberOfSeats: true,
                vehicle: true,
                price: true,
            },
        });
        if (!ridesData) {
            res.status(404).json({ msg: "Ride not found" });
            return;
        }
        const filteredRidedata = ridesData.filter((ride) => {
            var _a, _b;
            return ((_a = ride.user) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        });
        res.status(200).json({ msg: "Ride is fecthed successfully", ridesData: filteredRidedata });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in fetching  User Info", {
                email: (_a = req.body) === null || _a === void 0 ? void 0 : _a.email,
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
                    email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
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
                    email: (_c = req.body) === null || _c === void 0 ? void 0 : _c.email,
                    error: error.message,
                });
                res.status(408).json({
                    error: "Something went wrong. Try again ",
                });
                return;
            }
            // Prisma's timeout error code
        }
        logger_1.default.error("Error occurred in updating ride details", {
            email: (_d = req.body) === null || _d === void 0 ? void 0 : _d.email,
            error: error,
        });
        res.status(500).json({ error: "An error occurred during login." });
    }
});
exports.fetchRidesData = fetchRidesData;
const getUserRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { rideId } = req.params;
        const userGender = yield prisma_1.prisma.user.findUnique({
            where: {
                id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            },
            select: {
                gender: true
            }
        });
        const rideMeta = yield prisma_1.prisma.rides.findUnique({
            where: { id: rideId },
            select: { genderPreference: true },
        });
        if (!rideMeta) {
            throw new Error("Ride not found");
        }
        const ridesData = yield prisma_1.prisma.rides.findUnique({
            where: Object.assign({ id: rideId }, (rideMeta.genderPreference !== "both" && {
                genderPreference: userGender === null || userGender === void 0 ? void 0 : userGender.gender,
            })),
            select: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        phoneNumber: true,
                        name: true,
                        gender: true
                    },
                },
                id: true,
                destination: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                source: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                date: true,
                time: true,
                numberOfSeats: true,
                vehicle: true,
                meetingPoints: true,
                additionalInfo: true,
                price: true,
                phoneNumber: true,
                genderPreference: true,
                allowInAppChat: true,
            },
        });
        if (!ridesData) {
            res.status(404).json({ msg: "Ride not found" });
            return;
        }
        res.status(200).json({ msg: "Ride is fecthed successfully", ridesData });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in fetching  User Info", {
                email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
                error: error.message,
            });
            res.status(500).json({
                message: "Server error Occured",
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
        logger_1.default.error("Error occurred in updating ride details", {
            email: (_e = req.body) === null || _e === void 0 ? void 0 : _e.email,
            error: error,
        });
        res.status(500).json({ message: "An error occurred during login." });
    }
});
exports.getUserRide = getUserRide;
const getAllRideOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const ridesData = yield prisma_1.prisma.rides.findMany({
            where: {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        phoneNumber: true,
                        name: true,
                        gender: true
                    },
                },
                id: true,
                destination: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                source: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                date: true,
                time: true,
                numberOfSeats: true,
                vehicle: true,
                meetingPoints: true,
                additionalInfo: true,
                price: true,
                phoneNumber: true,
                genderPreference: true
            },
        });
        if (!ridesData) {
            res.status(404).json({ msg: "Ride not found" });
            return;
        }
        res.status(200).json({ msg: "Ride is fecthed successfully", ridesData });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in fetching  User Info", {
                email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
                error: error.message,
            });
            res.status(500).json({
                message: "Server error Occured",
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
        logger_1.default.error("Error occurred in updating ride details", {
            email: (_e = req.body) === null || _e === void 0 ? void 0 : _e.email,
            error: error,
        });
        res.status(500).json({ message: "An error occurred during login." });
    }
});
exports.getAllRideOfUser = getAllRideOfUser;
const deleteRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { rideId } = req.params;
        const deleteRideCount = yield prisma_1.prisma.rides.deleteMany({
            where: {
                id: rideId,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        if (deleteRideCount === 0) {
            res.status(404).json({ msg: "Ride not found" });
            return;
        }
        res.status(200).json({ msg: "Ride is created successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error("Error occurred in fetching  User Info", {
                email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
                error: error.message,
            });
            res.status(500).json({
                message: "Server error Occured",
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
        logger_1.default.error("Error occurred in updating ride details", {
            email: (_e = req.body) === null || _e === void 0 ? void 0 : _e.email,
            error: error,
        });
        res.status(500).json({ message: "An error occurred during login." });
    }
});
exports.deleteRide = deleteRide;
