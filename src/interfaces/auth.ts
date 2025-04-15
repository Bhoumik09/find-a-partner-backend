import { z } from "zod";
import { loginInSchema, signUpSchema } from "../models/auth";

export type signUpData=z.infer<typeof signUpSchema>
export type loginInData=z.infer<typeof loginInSchema>
export interface AuthRequest extends Request {
    user?: {
      id: string;
    };
  }