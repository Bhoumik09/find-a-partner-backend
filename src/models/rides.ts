import { genderPreference } from "@prisma/client";
import { z } from "zod";

export const createRideSchema = z.object({
    source: z.number().int().positive(), // Ensures sourceID is a positive integer
    destination: z.number().int().positive(), // Ensures destinationID is a positive integer
    date: z.string(),
    time: z.string(),
    seats: z.string().optional(), // Ensures seats is a positive integer (limit max seats to 10)
    vehicleName: z.string().min(2, "Vehicle name must be at least 2 characters"),
    price: z.number().positive(), // Ensures price is a positive number
    number: z.string().min(10, "Invalid phone number").max(15), // Ensures valid phone number length
    genderPreference: z.enum([genderPreference.male, genderPreference.female, genderPreference.both]), // Restricts genderPreference to specific values
    additionalInfo: z.string().optional(), // Optional field
    meetingPointArr: z.array(z.string()), // Ensures at least one meeting point
    allowInAppChat: z.boolean().default(false), // Ensures boolean value with a default of false
  });
  export const updateRideSchema = z.object({
    sourceID: z.number().int().positive().optional(), // Ensures sourceID is a positive integer
    destinationID: z.number().int().positive().optional(), // Ensures destinationID is a positive integer
    date: z.preprocess((val)=>(typeof val==='string'?new Date(val):val),z.date()).optional(), // Ensures date is a valid date object
    time: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()).optional(),
    seats: z.string().optional(), // Ensures seats is a positive integer (limit max seats to 10)
    vehicleName: z.string().min(2, "Vehicle name must be at least 2 characters").optional(),
    price: z.number().positive().optional(), // Ensures price is a positive number
    number: z.string().min(10, "Invalid phone number").max(15).optional(), // Ensures valid phone number length
    genderPreference: z.enum([genderPreference.male, genderPreference.female, genderPreference.both]).optional(), // Restricts genderPreference to specific values
    additionalInfo: z.string().optional(), // Optional field
    meetingPoint: z.array(z.string()).min(1, "At least one meeting point required").optional(), // Ensures at least one meeting point
    allowInAppChat: z.boolean().default(false).optional(), // Ensures boolean value with a default of false
  });
