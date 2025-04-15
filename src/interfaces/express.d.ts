// express.d.ts
import * as express from "express";

// Extending the Request interface to include a `user` property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}
