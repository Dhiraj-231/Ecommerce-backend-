import Joi from "joi";
import User from "../Models/User.js";
import CustomErrorHandler from "../Services/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../Services/JwtServices.js";
import { REF_SECRET } from "../config/index.js";
import RefreshToken from "../Models/RefreshToken.js";

export const Login = async (req, res, next) => {
  //validating request
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return next(error);
  }
  const { email, password } = req.body;
  let access_token;
  let refresh_token;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(CustomErrorHandler.UsernotExist());
    }
    //compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(CustomErrorHandler.UsernotExist());
    }
    //generating token
    const payload = {
      _id: user._id,
      role: user.role,
    };
    access_token = JwtService.sign(payload);
    refresh_token = JwtService.sign(payload, "1y", REF_SECRET);
    const refToken = new RefreshToken({
      token: refresh_token,
    });
    await refToken.save();
    res.status(200).json({ msg: "Ok oK", access_token, refresh_token });
  } catch (error) {
    return next(error);
  }
};
