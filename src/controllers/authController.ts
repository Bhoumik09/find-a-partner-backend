import { Gender, Prisma } from "@prisma/client";
import logger from "../../logger";
import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { loginInData, signUpData } from "../interfaces/auth";
const key:string|undefined=process.env.SECRET_KEY;

export const fetchUser = async (req: Request, res: Response) => {
  try {
    const userInfo: {
      id: string;
      phoneNumber: string;
      name: string;
      gender: Gender;
    } | null = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        gender: true,
      },
    });
    if (!userInfo) {
      res.status(404).json({
        error: "User not found ",
      });
      return;
    }

    res
      .status(200)
      .json({ msg: "User Logged In Successfully", userInfo: userInfo });
  } catch (error) {
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
export const fetchUserName = async (req: Request, res: Response) => {
  try {
    const userInfo: { name: string } | null = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      select: {
        name: true,
        id: true,
      },
    });
    console.log(userInfo);
    if (!userInfo) {
      res.status(404).json({
        error: "User not found ",
      });
      return;
    }

    res
      .status(200)
      .json({ msg: "User Logged In Successfully", userInfo: userInfo });
  } catch (error) {
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
export const login = async (req: Request, res: Response) => {
  const { username, phoneNumber, password }: loginInData = req.body;
  console.log(req.body);
  try {
    const findUser: { id: string; password: string } | null =
      await prisma.user.findUnique({
        where: {
          name_phoneNumber: {
            name: username,
            phoneNumber,
          },
        },
        select: {
          id: true,
          password: true,
        },
      });
    if (!findUser) {
      res.status(404).json({
        error: "Either the username or phoneNumber provided is incorrect ",
      });
      return;
    }
    const passwordMatches: boolean = bcryptjs.compareSync(
      password,
      findUser.password
    );
    if (!passwordMatches) {
      res.status(404).json({ error: "The password provided is Incorrect" });
      return;
    }
    const payload: { id: string } = {
      id: findUser.id,
    };
    const token: string = jwt.sign(payload,key!, {
      expiresIn: "7h",
    });
    console.log(token);
    res.status(200).json({ msg: "User Logged In Successfully", token });
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error occurred in login in the User", {
        username: req.body?.username,
        phoneNumber: req.body?.phoneNumber,
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
          username: req.body?.username,
          phoneNumber: req.body?.phoneNumber,
          error: error.message,
        });
        res.status(408).json({
          error: "Transaction took too long and was aborted. Please try again.",
        });
        return;
      } else {
        console.error(`🔴 Prisma Error (${error.code}):`, error.message);
        logger.error("Prisma error", {
          username: req.body?.username,
          phoneNumber: req.body?.phoneNumber,
          error: error.message,
        });
        res.status(408).json({
          error: "Something went wrong. Try again ",
        });
        return;
      }
      // Prisma's timeout error code
    }

    logger.error("Error occurred in creating User", {
      email: req.body?.email,
      error: error,
    });
    res.status(500).json({ error: "An error occurred during login." });
  }
};
export const signUp = async (req: Request, res: Response) => {
  console.log(signUp)
  const { username, email, gender, phoneNumber, password }: signUpData =
    req.body;
  try {
    console.log(req.body);
    const checkDuplicateNumber: { id: string } | null =
      await prisma.user.findUnique({
        where: {
          name_phoneNumber: {
            name: username,
            phoneNumber: phoneNumber,
          },
        },
        select: {
          id: true,
        },
      });
    console.log(checkDuplicateNumber);
    if (checkDuplicateNumber) {
      res.status(404).json({
        error: "Either the phone number or username provided is already registered",
      });
      logger.warn("Both username and phone number are alreaddy registered", {
        email,
        phoneNumber,
      });
      return;
    }
    const hashedPassword: string = await bcryptjs.hash(password, 10);

    await prisma.user.create({
      data: {
        name: username,
        email,
        gender,
        password: hashedPassword,
        phoneNumber,
      },
    });
    res.status(200).json({ msg: "User is successfully registered" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error occurred in creating User", {
        username: req.body?.username,
        phoneNumber: req.body?.phoneNumber,
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
          username: req.body?.username,
          phoneNumber: req.body?.phoneNumber,
          error: error.message,
        });
        res.status(408).json({
          error: "Transaction took too long and was aborted. Please try again.",
        });
        return;
      } else {
        console.error(`🔴 Prisma Error (${error.code}):`, error.message);
        logger.error("Prisma error", {
          username: req.body?.username,
          phoneNumber: req.body?.phoneNumber,
          error: error.message,
        });
        res.status(408).json({
          error: "Something went wrong. Try again ",
        });
        return;
      }
      // Prisma's timeout error code
    }

    logger.error("Error occurred in creating User", {
      username: req.body?.username,
      phoneNumber: req.body?.phoneNumber,
      error: error,
    });
    res.status(500).json({ error: "An error occurred during signup." });
  }
};
