import express, { Response, Request } from "express";
const authRouter = express.Router();

import jwt from "jsonwebtoken";
import { validateRequest } from "../middleware/zodMiddleware";
import { loginInSchema, signUpSchema } from "../models/auth";
import { authenticateUser } from "../middleware/middleware";
import logger from "../../logger";
import { fetchUser, fetchUserName, login, signUp } from "../controllers/authController";
authRouter.post("/signup", validateRequest(signUpSchema), signUp);

authRouter.post("/login", validateRequest(loginInSchema), login);

authRouter.get("/fetch-user", authenticateUser, fetchUser);
authRouter.get("/fetch-user-name", authenticateUser, fetchUserName);
export default authRouter;