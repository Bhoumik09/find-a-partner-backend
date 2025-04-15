import express, { Request, Response } from "express";
const ridesRouter = express.Router();

import { validateRequest } from "../middleware/zodMiddleware";
import { loginInSchema, signUpSchema } from "../models/auth";
import { authenticateUser } from "../middleware/middleware";
import { fetchUser, login, signUp } from "../controllers/authController";
console.log('enter')
import { createRideSchema, updateRideSchema } from "../models/rides";

import { createRide, deleteRide, fetchRidesData, getAllRideOfUser, getUserRide, updateRide } from "../controllers/ridesController";
ridesRouter.get("/find-rides",authenticateUser, fetchRidesData);
ridesRouter.post(
  "/create-ride",
  validateRequest(createRideSchema),
  authenticateUser,
  createRide
);
ridesRouter.get('/user-rides',authenticateUser,getAllRideOfUser)
ridesRouter.get("/ride/:rideId",authenticateUser, getUserRide);
ridesRouter.put(
  "/ride/:rideId",
  validateRequest(updateRideSchema),
  authenticateUser,
  updateRide
);
ridesRouter.delete("/ride/:rideId",authenticateUser, deleteRide);
export default ridesRouter;
