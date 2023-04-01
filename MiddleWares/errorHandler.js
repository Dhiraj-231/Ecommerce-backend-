import CustomErrorHandler from "../Services/CustomErrorHandler.js";
import { DEBUG_MODE } from "../config/index.js";
import pkg from "joi";
const { ValidationError } = pkg;
const errorHandler = (err, req, res, next) => {
  console.log(err instanceof CustomErrorHandler)
  if (err instanceof ValidationError) {
    statusCode = 422;
    data = {
      message: err.message,
    };
  }
  if (err instanceof CustomErrorHandler) {
    console.log("Giving error ErrorHandler" + err.message);
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }
  let statusCode = 500;
  let data = {
    message: "Internal server error",
    ...(DEBUG_MODE === "true" && { orginalError: err.message }),
  };
  return res.status(statusCode).json(data);
};
export default errorHandler;
