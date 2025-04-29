import { NextFunction, Request, Response } from "express";

type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (controller: AsyncControllerType): AsyncControllerType =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error); // If an error happens inside the async function, it will be passed by the asyncHandler to the error handler middleware
    }
  };
// This will help us to handle the errors in the async function and pass it to the error handler middleware
