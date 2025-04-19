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
exports.getAllPlaces = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const prisma_1 = require("../config/prisma");
const getAllPlaces = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const places = yield prisma_1.prisma.places.findMany();
        res.status(200).json({ msg: "All Places", places });
    }
    catch (error) {
        logger_1.default.error("Error occurred in fetching  All Places");
        res.status(500).json({ msg: "Fadiled to get All Places" });
    }
});
exports.getAllPlaces = getAllPlaces;
