import passport from "passport";
import {Request} from "express";
import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import { config  } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enums";
import { loginOrCreateAccountService } from "../services/auth.services";

passport.use(
  new GoogleStrategy(
    {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
        scope:["profile","email"],
    },
    async(req:Request,accessToken,refreshToken,profile,done)=>{
        try{
            const {email,sub:googleId,picture}= profile._json;
            console.log(profile,"profile");
            console.log(googleId,"googleId");
            if(!googleId){
                throw new NotFoundException("Google ID not found in profile");
            }
            const {user}= await loginOrCreateAccountService({
                provider:ProviderEnum.GOOGLE,
                displayName:profile.displayName,
                providerId:googleId,
                picture:picture,
                email:email,
            });
            done(null,user);
        }catch(err){
            done(err,false);
        }
    }

  )
)

passport.serializeUser((user:any,done)=>done(null,user))
passport.deserializeUser((user:any,done)=>done(null,user))