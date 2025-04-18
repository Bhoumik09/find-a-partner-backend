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
    source: z.number().int().positive(), // Ensures sourceID is a positive integer
    destination: z.number().int().positive(), // Ensures destinationID is a positive integer
    date: z.preprocess((val)=>(typeof val==='string'?new Date(val):val),z.date()), // Ensures date is a valid date object
    time: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()),
    seats: z.string(), // Ensures seats is a positive integer (limit max seats to 10)
    vehicleName: z.string().min(2, "Vehicle name must be at least 2 characters").trim(),
    price: z.number().positive(), // Ensures price is a positive number
    number: z.string().min(10, "Invalid phone number").max(10), // Ensures valid phone number length
    genderPreference: z.enum([genderPreference.male, genderPreference.female, genderPreference.both]), // Restricts genderPreference to specific values
    additionalInfo: z.string(), // Optional field
    meetingPointArr: z.array(z.string()).min(1, "At least one meeting point required"), // Ensures at least one meeting point
    allowChat: z.boolean().default(false), // Ensures boolean value with a default of false
  });
