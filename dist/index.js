"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const rides_1 = __importDefault(require("./routes/rides"));
const places_1 = __importDefault(require("./routes/places"));
app.use((0, cors_1.default)({
    origin: ['https://find-ride-partner-igqy.vercel.app', 'http://localhost:3000']
}));
dotenv_1.default.config();
app.use((req, _, next) => {
    console.log("➡️ Request:", req.method, req.url);
    next();
});
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/rides", rides_1.default);
app.use("/places", places_1.default);
app.listen(5000, () => {
    console.log('server running on 5000');
});
