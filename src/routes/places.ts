import { getAllPlaces } from "../controllers/placesConrtoller";
import express from 'express'
const placesRouter = express.Router();
placesRouter.get('/all-places',getAllPlaces);
export default placesRouter;