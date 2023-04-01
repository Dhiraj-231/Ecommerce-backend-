import CustomErrorHandler from "../Services/CustomErrorHandler.js";
import JwtService from "../Services/JwtServices.js";

const auth=async(req,res,next)=>{
    let authHeader=req.headers.authorization
    if(!authHeader){
        return next(CustomErrorHandler.UnAuthorized());
    }
    const token=authHeader.split(" ")[1];
    try {
        const {_id,role}= await JwtService.verify1(token);
        const user={
            _id,
            role
        }
        req.user=user;
        next();
        
    } catch (error) {
        return next(CustomErrorHandler.UnAuthorized());
    }
}
export default auth;