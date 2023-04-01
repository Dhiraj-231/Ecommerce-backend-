import User from "../Models/User.js";
import CustomErrorHandler from "../Services/CustomErrorHandler.js";

export const Me=async(req,res,next)=>{
    try {
        const user= await User.findOne({_id:req.user._id}).select("-password -updatedAt -__v");
        if(!user){
            return next(CustomErrorHandler.NotFound());
        }
        res.json({user})
    } catch (error) {
       return next(error); 
    }
}

