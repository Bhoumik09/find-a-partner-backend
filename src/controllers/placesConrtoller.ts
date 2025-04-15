import { Prisma } from "@prisma/client";
import logger from "../../logger";
import { Request, Response } from "express";
import { prisma } from "../config/prisma";
export const getAllPlaces = async (_:Request, res: Response) => {
  try {
    const places = await prisma.places.findMany();
    res.status(200).json({ msg: "All Places", places });
  } catch (error) {
    logger.error("Error occurred in fetching  All Places");

    res.status(500).json({ msg: "Fadiled to get All Places" });
  }
};
