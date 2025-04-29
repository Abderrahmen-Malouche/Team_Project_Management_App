import "dotenv/config";
import express,{NextFunction,Request,Response} from "express";
import cors from "cors";
import session from "cookie-session";
import {config} from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";


const app=express();
const BASE_PATH=config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({extended:true}));// This will hepl us to parse the data from the form data not the json data 

app.use(session({
    name:"session",// name of the session cookie
    keys:[config.SESSION_SECRET],// secret key to encrypt the session cookie
    maxAge:24*60*60*1000,//24 hours in milliseconds
    httpOnly:true,// httpOnly:true, this will help us to prevent the client side javascript to access the cookie
    secure:config.NODE_ENV==="production", // this will help us to set the cookie only for https connection
    sameSite:"lax", // this will help us to prevent the cross site request forgery attack
})) //session cookie is important for authentication and authorization 

app.use(passport.initialize());
app.use(passport.session()); 

app.use(cors({
    origin:config.FRONTEND_ORIGIN,
    credentials:true,// this will help us to send the cookies with the request
}))

app.use(`${BASE_PATH}/auth`,authRoutes);

app.use(errorHandler)

app.listen(config.PORT,async()=>{
    console.log(`Server is running on port ${config.PORT}`);
    await connectDatabase();
}
)
