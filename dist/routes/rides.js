"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ridesRouter = express_1.default.Router();
const zodMiddleware_1 = require("../middleware/zodMiddleware");
const middleware_1 = require("../middleware/middleware");
const rides_1 = require("../models/rides");
const ridesController_1 = require("../controllers/ridesController");
ridesRouter.get("/find-rides", middleware_1.authenticateUser, ridesController_1.fetchRidesData);
ridesRouter.post("/create-ride", (0, zodMiddleware_1.validateRequest)(rides_1.createRideSchema), middleware_1.authenticateUser, ridesController_1.createRide);
ridesRouter.get('/user-rides', middleware_1.authenticateUser, ridesController_1.getAllRideOfUser);
ridesRouter.get("/ride/:rideId", middleware_1.authenticateUser, ridesController_1.getUserRide);
ridesRouter.put("/ride/:rideId", (0, zodMiddleware_1.validateRequest)(rides_1.updateRideSchema), middleware_1.authenticateUser, ridesController_1.updateRide);
ridesRouter.delete("/ride/:rideId", middleware_1.authenticateUser, ridesController_1.deleteRide);
exports.default = ridesRouter;
