import { z } from "zod";

export const signUpSchema = z.object({
    username: z.string().min(2, "Username cannot be left empty"),
    email: z.string().optional(),
    phoneNumber: z.string().min(10, "Phone Number cannot be left empty"),
    password: z.string().min(6, "Password cannot be left empty"),
    gender: z.enum(["male", "female"])
  });
export const loginInSchema = z.object({
    username:z.string({required_error:"Username cannot be left empty"}).min(2),
    phoneNumber:z.string({required_error:"Phone Number cannot be left empty"}).min(9),
    password:z.string({required_error:"Password cannot be left empty"}).min(6),
})
