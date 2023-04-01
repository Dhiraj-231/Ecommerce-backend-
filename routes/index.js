import express from "express";
import { register } from "../controllers/RegisterController.js";
import { Login } from "../controllers/LoginController.js";
import { Me } from "../controllers/MeController.js";
import auth from "../MiddleWares/auth.js";
import refresh from "../controllers/RefreshController.js"
const router=express.Router();

router.post("/register",register);
router.post("/login",Login);
router.get("/me",auth,Me);
router.post("/refresh",refresh)

export default router;