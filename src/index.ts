import express, { Application, NextFunction, Request, Response } from 'express';
import authRouter from './routes/auth';
import dotenv from 'dotenv';
import cors from 'cors';
import ridesRouter from './routes/rides';
import placesRouter from './routes/places';

dotenv.config();

const app: Application = express();

app.use(cors({
  origin: ['https://find-ride-partner-igqy.vercel.app', 'http://localhost:3000']
}));

app.use((req: Request, _, next: NextFunction) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/rides", ridesRouter);
app.use("/places", placesRouter);
app.get('/', (_, res) => {
  res.send("Welcome to find my partner backend");
});

// REMOVE app.listen(5000, ...)

// Export a handler for Vercel serverless functions
export default (req: Request, res: Response) => {
  app(req, res);
};
