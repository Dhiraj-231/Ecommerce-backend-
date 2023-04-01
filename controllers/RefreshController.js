import Joi from "joi";
import RefreshToken from "../Models/RefreshToken.js";
import CustomErrorHandler from "../Services/CustomErrorHandler.js";
import JwtService from "../Services/JwtServices.js";
import { REF_SECRET } from "../config/index.js";
import User from "../Models/User.js";

export default async (req, res, next) => {
  //validate
  const refreshSchema = Joi.object({
    refreshtoken: Joi.string().required(),
  });

  const { error } = refreshSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  //checking the refresh_token from database(Avialable or not)
  const { refreshtoken } = req.body;
  let tokenMatch;
  let access_token;
  let refresh_token;
  try {
      tokenMatch = await RefreshToken.findOne({ token: refreshtoken });
      if (!tokenMatch) {
          return next(CustomErrorHandler.UnAuthorized("Invalid refersh token"));
      }
      let userId;

      try {
          const { _id } = await JwtService.verify1(tokenMatch.token, REF_SECRET);
          userId = _id;
      } catch (error) {
          return next(CustomErrorHandler.UnAuthorized("Invalid refersh token"));
      }
      const user=await User.findOne({_id:userId});
      if(!user){
        return next(CustomErrorHandler.UnAuthorized("User not Found"))
      }
      //token generation
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
      res.status(200).json({access_token, refresh_token });
  } catch (error) {
    return next(new Error("Something went wrong! " + error.message));
  }
};
