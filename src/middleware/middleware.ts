import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();
const key:string|undefined=process.env.SECRET_KEY;
// Middleware to verify JWT and attach user info to req
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token
 
  if (!token) {
     res.status(403).json({ msg: "No token provided" });

     return;
  }

  // Verify token
  jwt.verify(token, key!, (err, decoded) => {
    if (err) {
       res.status(401).json({ msg: "Invalid token" });
       return;
    }
    // Attach the user info to req
    req.user = { id: (decoded as { id: string }).id };
    // Move to the next middleware/route handler
    next();

  });
};
