import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
export const errorHandler:ErrorRequestHandler= (error,req,res,next):any=>{ // If an error happens inside the asxync function, it will be passed by the asyncHandler to the error handler middleware
    console.error(`Error occured on Path : ${req.path}`,error)
    if(error instanceof SyntaxError){
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message:"Invalid JSON format. Please check your request body "
        });

    }
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message:"Internal Server Error",
        error:error?.message || "Unknow Error Occured "
    })
}