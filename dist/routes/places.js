"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const placesConrtoller_1 = require("../controllers/placesConrtoller");
const express_1 = __importDefault(require("express"));
const placesRouter = express_1.default.Router();
placesRouter.get('/all-places', placesConrtoller_1.getAllPlaces);
exports.default = placesRouter;
