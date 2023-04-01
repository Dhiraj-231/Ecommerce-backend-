import Joi from "joi";
import CustomErrorHandler from "../Services/CustomErrorHandler.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import JwtService from "../Services/JwtServices.js";
export const register = async (req, res, next) => {
  //validation
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    repeat_password: Joi.ref("password"),
    role: Joi.string(),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return next(error);
  }
  //Destructuring the recevied data
  const { name, email, password, role } = req.body;
  //Checking if the user is in database or not
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(CustomErrorHandler.alreadyExist("Email already exist"));
    }
  } catch (error) {
    return next(error);
  }
  //Hashing the password we received by user
  const hashPassword = await bcrypt.hash(password, 10);

  let access_token;
  try {
    const data = new User({
      name,
      email,
      password: hashPassword,
      role,
    });
    const date = await data.save();

    //token generation
    const payload = {
      _id: data._id,
      role: data.role,
    };
    access_token = JwtService.sign(payload);
  } catch (error) {
    return next(error);
  }
  res.status(200).json({
    message: "Data recevied",
  });
};
