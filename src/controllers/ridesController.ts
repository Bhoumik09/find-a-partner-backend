import { Gender, genderPreference, Prisma } from "@prisma/client";
import logger from "../config/logger";
import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { createRideType, rideType, updateRideType } from "../interfaces/rides";

export const createRide = async (req: Request, res: Response) => {
 
  const {
    source,
    destination,
    date,
    time,
    seats,
    vehicleName,
    price,
    number,
    genderPreference,
    additionalInfo,
    meetingPointArr,
    allowInAppChat,
  }: createRideType = req.body;
  try {
    const userId = req.user!.id;

    const userPhoneNumber: { phoneNumber: string } | null =
      await prisma.user.findUnique({
        where: { id: userId },
        select: { phoneNumber: true },
      });
   
    const ride = await prisma.rides.create({
      data: {
        sourceId: source,
        destinationId: destination,
        date: new Date(date),
        time: new Date(time),
        numberOfSeats: Number(seats),
        vehicle: vehicleName,
        price,
        phoneNumber: number || userPhoneNumber!.phoneNumber,
        genderPreference,
        additionalInfo,
        meetingPoints: meetingPointArr,
        allowInAppChat,
        userId: userId,
      },
    });
    res.status(200).json({ msg: "Ride is created successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error occurred in fetching  User Info", {
        email: req.body?.email,
        error: error.message,
      });
      res.status(500).json({
        error: "Server error Occured",
      });
      return;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2028") {
        console.error("⚠️ Transaction Timeout: The query took too long.");
        logger.error("Transaction Timeout", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Transaction took too long and was aborted. Please try again.",
        });
        return;
      } else {
        console.error(`🔴 Prisma Error (${error.code}):`, error.message);
        logger.error("Prisma error", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Something went wrong. Try again ",
        });
        return;
      }
      // Prisma's timeout error code
    }

    logger.error("Error occurred in fetching user details", {
      email: req.body?.email,
      error: error,
    });
    res.status(500).json({ error: "An error occurred during login." });
  }
};
export const updateRide = async (req: Request, res: Response) => {
  const {
    source,
    destination,
    date,
    time,
    seats,
    vehicleName,
    price,
    number,
    genderPreference,
    additionalInfo,
    meetingPointArr,
    allowChat,
  }: updateRideType = req.body;
  try {
    const { rideId } = req.params as { rideId: string };
    const userId = req.user!.id;
    const userPhoneNumber: { phoneNumber: string } | null =
      await prisma.user.findUnique({
        where: { id: userId },
        select: { phoneNumber: true },
      });
    const updatedRide: { id: string } | null = await prisma.rides.update({
      where: {
        id: rideId,
        userId: req.user?.id,
      },
      data: {
        sourceId:source,
        destinationId:  destination,
        date: date,
        time: time,
        numberOfSeats: Number(seats),
        vehicle: vehicleName,
        price: price,
        phoneNumber: number || userPhoneNumber!.phoneNumber,
        genderPreference: genderPreference,
        additionalInfo: additionalInfo,
        meetingPoints:  meetingPointArr,
        allowInAppChat:allowChat,
        userId: userId,
      },
      
    });
    console.log('updated rile');
    console.log(updatedRide);
    if (!updatedRide) {
      res.status(404).json({ msg: "Ride not found" });
      return;
    }
    res.status(200).json({ msg: "Ride is created successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error occurred in fetching  User Info", {
        email: req.body?.email,
        error: error.message,
      });
      res.status(500).json({
        message: "Server error Occured",
      });
      return;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2028") {
        console.error("⚠️ Transaction Timeout: The query took too long.");
        logger.error("Transaction Timeout", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Transaction took too long and was aborted. Please try again.",
        });
        return;
      } else {
        console.error(`🔴 Prisma Error (${error.code}):`, error.message);
        logger.error("Prisma error", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Something went wrong. Try again ",
        });
        return;
      }
      // Prisma's timeout error code
    }

    logger.error("Error occurred in updating ride details", {
      email: req.body?.email,
      error: error,
    });
    res.status(500).json({ message: "An error occurred during login." });
  }
};

export const fetchRidesData = async (req: Request, res: Response) => {
  
  try {
   
    const { sourceId, destinationId, date, seats, genderPreference } =
      req.query as {
        sourceId?: string;
        destinationId?: string;
        date?: string;
        seats?: string;
        genderPreference: "male" | "female" | "both";
      };
    
   
    const ridesData: Partial<rideType>[] | null = await prisma.rides.findMany({
      where: {
        
        sourceId: sourceId ? Number(sourceId) : undefined,
        destinationId: destinationId ? Number(destinationId) : undefined,
        date: date ? new Date(date) : undefined,
        numberOfSeats: seats ? Number(seats) : undefined,
        genderPreference:genderPreference=='both'?'both':genderPreference
      },
      select: {
        user: {
          select: {
            id: true,
            gender:true,
            name: true,
          },
        },
        id: true,
        destination: {
          select: {
            name: true,
            id: true,
          },
        },
        genderPreference: true,
        source: {
          select: {
            name: true,
            id: true,
          },
        },
        date: true,
        time: true,
        numberOfSeats: true,
        vehicle: true,
        price: true,
      },
    });
    if (!ridesData) {
      res.status(404).json({ msg: "Ride not found" });
      return;
    }
    const filteredRidedata=ridesData.filter((ride)=>{
      
      return ride.user?.id!==req.user?.id
    })
    res.status(200).json({ msg: "Ride is fecthed successfully", ridesData :filteredRidedata});
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error occurred in fetching  User Info", {
        email: req.body?.email,
        error: error.message,
      });
      res.status(500).json({
        error: "Server error Occured",
      });
      return;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2028") {
        console.error("⚠️ Transaction Timeout: The query took too long.");
        logger.error("Transaction Timeout", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Transaction took too long and was aborted. Please try again.",
        });
        return;
      } else {
        console.error(`🔴 Prisma Error (${error.code}):`, error.message);
        logger.error("Prisma error", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Something went wrong. Try again ",
        });
        return;
      }
      // Prisma's timeout error code
    }

    logger.error("Error occurred in updating ride details", {
      email: req.body?.email,
      error: error,
    });
    res.status(500).json({ error: "An error occurred during login." });
  }
};
export const getUserRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params as { rideId: string };
    const userGender:{gender:Gender}|null = await prisma.user.findUnique({
      where:{
        id:req.user?.id
      },
      select:{
        gender:true
      }
    })
    const rideMeta = await prisma.rides.findUnique({
      where: { id: rideId },
      select: { genderPreference: true },
    });
    
    if (!rideMeta) {
      throw new Error("Ride not found");
    }
    
    const ridesData: Partial<rideType> | null = await prisma.rides.findUnique({
      where: {
        id: rideId,
        ...(rideMeta.genderPreference !== "both" && {
          genderPreference: userGender?.gender,
        }),
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            gender:true
          },
        },
        id: true,
        destination: {
          select: {
            name: true,
            id: true,
          },
        },
        source: {
          select: {
            name: true,
            id: true,
          },
        },
        date: true,
        time: true,
        numberOfSeats: true,
        vehicle: true,
        meetingPoints: true,
        additionalInfo: true,
        price: true,
        phoneNumber: true,
        genderPreference:true,
        allowInAppChat:true,
      },
    });
    if (!ridesData) {
      res.status(404).json({ msg: "Ride not found" });
      return;
    }
    res.status(200).json({ msg: "Ride is fecthed successfully", ridesData });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error occurred in fetching  User Info", {
        email: req.body?.email,
        error: error.message,
      });
      res.status(500).json({
        message: "Server error Occured",
      });
      return;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2028") {
        console.error("⚠️ Transaction Timeout: The query took too long.");
        logger.error("Transaction Timeout", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Transaction took too long and was aborted. Please try again.",
        });
        return;
      } else {
        console.error(`🔴 Prisma Error (${error.code}):`, error.message);
        logger.error("Prisma error", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Something went wrong. Try again ",
        });
        return;
      }
      // Prisma's timeout error code
    }

    logger.error("Error occurred in updating ride details", {
      email: req.body?.email,
      error: error,
    });
    res.status(500).json({ message: "An error occurred during login." });
  }
};
export const getAllRideOfUser = async (req: Request, res: Response) => {
  try {

    const ridesData: Partial<rideType>[] | null = await prisma.rides.findMany({
      where: {
        userId: req.user?.id,
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            phoneNumber: true,
            name: true,
            gender:true
          },
        },
        id: true,
        destination: {
          select: {
            name: true,
            id: true,
          },
        },
        source: {
          select: {
            name: true,
            id: true,
          },
        },
        date: true,
        time: true,
        numberOfSeats: true,
        vehicle: true,
        meetingPoints: true,
        additionalInfo: true,
        price: true,
        phoneNumber: true,
        genderPreference:true
      },
    });
    if (!ridesData) {
      res.status(404).json({ msg: "Ride not found" });
      return;
    }
    res.status(200).json({ msg: "Ride is fecthed successfully", ridesData });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error occurred in fetching  User Info", {
        email: req.body?.email,
        error: error.message,
      });
      res.status(500).json({
        message: "Server error Occured",
      });
      return;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2028") {
        console.error("⚠️ Transaction Timeout: The query took too long.");
        logger.error("Transaction Timeout", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Transaction took too long and was aborted. Please try again.",
        });
        return;
      } else {
        console.error(`🔴 Prisma Error (${error.code}):`, error.message);
        logger.error("Prisma error", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Something went wrong. Try again ",
        });
        return;
      }
      // Prisma's timeout error code
    }

    logger.error("Error occurred in updating ride details", {
      email: req.body?.email,
      error: error,
    });
    res.status(500).json({ message: "An error occurred during login." });
  }
};
export const deleteRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params as { rideId: string };

    const deleteRideCount: any | null = await prisma.rides.deleteMany({
      where: {
        id: rideId,
        userId: req.user?.id,
      },
    });
    if (deleteRideCount === 0) {
      res.status(404).json({ msg: "Ride not found" });
      return;
    }
    res.status(200).json({ msg: "Ride is created successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error occurred in fetching  User Info", {
        email: req.body?.email,
        error: error.message,
      });
      res.status(500).json({
        message: "Server error Occured",
      });
      return;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2028") {
        console.error("⚠️ Transaction Timeout: The query took too long.");
        logger.error("Transaction Timeout", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Transaction took too long and was aborted. Please try again.",
        });
        return;
      } else {
        console.error(`🔴 Prisma Error (${error.code}):`, error.message);
        logger.error("Prisma error", {
          email: req.body?.email,
          error: error.message,
        });
        res.status(408).json({
          error: "Something went wrong. Try again ",
        });
        return;
      }
      // Prisma's timeout error code
    }

    logger.error("Error occurred in updating ride details", {
      email: req.body?.email,
      error: error,
    });
    res.status(500).json({ message: "An error occurred during login." });
  }
};
