"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body); // Validate request body
            next(); // Proceed to the next middleware or route handler
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({ errors: error.errors });
                return;
            }
            res.status(500).json({ message: "Something went wrong" });
        }
    };
};
exports.validateRequest = validateRequest;
