import express, {Application} from 'express'
import authRouter from './routes/auth';
const app:Application=express();
import cors from 'cors'
import ridesRouter from './routes/rides';
import { prisma } from './config/prisma';
import placesRouter from './routes/places';
app.use(cors())
app.use((req, res, next) => {
    console.log("➡️ Request:", req.method, req.url);
    next();
  });
app.use(express.urlencoded())
app.use(express.json())
app.use("/auth",authRouter)
app.use("/rides",ridesRouter)
app.use("/places",placesRouter)
app.listen(5000, ()=>{
    console.log('server running on 5000')
})
