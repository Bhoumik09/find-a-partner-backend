import express, {Application, NextFunction, Request, Response} from 'express'
import authRouter from './routes/auth';
import dotenv from 'dotenv'

const app:Application=express();
import cors from 'cors'
import ridesRouter from './routes/rides';
import placesRouter from './routes/places';
app.use(cors({
  origin:'https://find-ride-partner-igqy.vercel.app'
}
))
dotenv.config()
app.use((req:Request, _, next:NextFunction) => {
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
