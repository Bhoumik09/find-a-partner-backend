import { z } from "zod";
import { createRideSchema, updateRideSchema } from "../models/rides";

export type createRideType = z.infer<typeof createRideSchema>;
export type updateRideType = z.infer<typeof updateRideSchema>;
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export type rideType = Prisma.RidesGetPayload<{
  include: {
    
    user: {
      select: {
        id: true;
       gender:true;
        name: true;
      };
    };
    destination: {
      select: {
        name: true;
        id: true;
      };
    };
    source: {
      select: {
        name: true;
        id: true;
      };
    };
  };
}>;
export type filteredRideType = Prisma.RidesGetPayload<{
    include: {
      
      user: {
        select: {
          id: true;
          email: true;
          phoneNumber: true;
          name: true;
        };
      };
      destination: {
        select: {
          name: true;
          id: true;
        };
      };
      source: {
        select: {
          name: true;
          id: true;
        };
      };
    };
  }>;
  