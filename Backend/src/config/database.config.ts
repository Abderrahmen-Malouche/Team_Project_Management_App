import mongoose from "mongoose";
import {config} from "./app.config";

const connectDatabase = async ()=>{
    try{
        await mongoose.connect(config.MONGO_URL);
        console.log("connected to the MongoDb")
    }
    catch (error){
        console.log("error connected to the mongo Database");
        process.exit(1);
    }
};

export default connectDatabase;
// This function will help us to connect to the mongo database using mongoose and it will also help us to handle the error if the connection is failed