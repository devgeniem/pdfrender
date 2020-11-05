import { Request, Response, NextFunction } from "express";
import { isControllerError } from "./ControllerError";

export const ErrorHandler = (
  error: Error,
  req: Request,
  response: Response,
  next: NextFunction
) => {
  if (isControllerError(error)) {
    response.status(error.responseCode).json({
      error: error.message
    });
    return;
  }
  next(error);
};
