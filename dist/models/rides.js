"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRideSchema = exports.createRideSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createRideSchema = zod_1.z.object({
    source: zod_1.z.number().int().positive(), // Ensures sourceID is a positive integer
    destination: zod_1.z.number().int().positive(), // Ensures destinationID is a positive integer
    date: zod_1.z.string(),
    time: zod_1.z.string(),
    seats: zod_1.z.string().optional(), // Ensures seats is a positive integer (limit max seats to 10)
    vehicleName: zod_1.z.string().min(2, "Vehicle name must be at least 2 characters"),
    price: zod_1.z.number().positive(), // Ensures price is a positive number
    number: zod_1.z.string().min(10, "Invalid phone number").max(15), // Ensures valid phone number length
    genderPreference: zod_1.z.enum([client_1.genderPreference.male, client_1.genderPreference.female, client_1.genderPreference.both]), // Restricts genderPreference to specific values
    additionalInfo: zod_1.z.string().optional(), // Optional field
    meetingPointArr: zod_1.z.array(zod_1.z.string()), // Ensures at least one meeting point
    allowInAppChat: zod_1.z.boolean().default(false), // Ensures boolean value with a default of false
});
exports.updateRideSchema = zod_1.z.object({
    source: zod_1.z.number().int().positive(), // Ensures sourceID is a positive integer
    destination: zod_1.z.number().int().positive(), // Ensures destinationID is a positive integer
    date: zod_1.z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), zod_1.z.date()), // Ensures date is a valid date object
    time: zod_1.z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), zod_1.z.date()),
    seats: zod_1.z.string(), // Ensures seats is a positive integer (limit max seats to 10)
    vehicleName: zod_1.z.string().min(2, "Vehicle name must be at least 2 characters").trim(),
    price: zod_1.z.number().positive(), // Ensures price is a positive number
    number: zod_1.z.string().min(10, "Invalid phone number").max(10), // Ensures valid phone number length
    genderPreference: zod_1.z.enum([client_1.genderPreference.male, client_1.genderPreference.female, client_1.genderPreference.both]), // Restricts genderPreference to specific values
    additionalInfo: zod_1.z.string(), // Optional field
    meetingPointArr: zod_1.z.array(zod_1.z.string()).min(1, "At least one meeting point required"), // Ensures at least one meeting point
    allowChat: zod_1.z.boolean().default(false), // Ensures boolean value with a default of false
});
