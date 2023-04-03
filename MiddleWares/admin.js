import User from "../Models/User.js"
import CustomErrorHandler from "../Services/CustomErrorHandler.js";

const admin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });

        if (user.role === 'admin') {
            next();
        } else {
            return next(CustomErrorHandler.UnAuthorized());
        }

    } catch (error) {
        return next(CustomErrorHandler.serverError())
    }
}

export default admin;