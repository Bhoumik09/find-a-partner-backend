import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { AuthRequest } from "../interfaces/auth";

export const validateRequest = (schema: ZodSchema<any>) => {
    return (req:Request , res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body); // Validate request body
            next(); // Proceed to the next middleware or route handler
        } catch (error ) {
            if (error instanceof ZodError) {
                 res.status(400).json({ errors: error.errors });
                 return;
            }
            res.status(500).json({ message: "Something went wrong" });
        }
    };
};
