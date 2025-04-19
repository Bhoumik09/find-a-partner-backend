"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginInSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
exports.signUpSchema = zod_1.z.object({
    username: zod_1.z.string().min(2, "Username cannot be left empty"),
    email: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().min(10, "Phone Number cannot be left empty"),
    password: zod_1.z.string().min(6, "Password cannot be left empty"),
    gender: zod_1.z.enum(["male", "female"])
});
exports.loginInSchema = zod_1.z.object({
    username: zod_1.z.string({ required_error: "Username cannot be left empty" }).min(2),
    phoneNumber: zod_1.z.string({ required_error: "Phone Number cannot be left empty" }).min(9),
    password: zod_1.z.string({ required_error: "Password cannot be left empty" }).min(6),
});
