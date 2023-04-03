import express from "express";
import { register } from "../controllers/RegisterController.js";
import { Login, logout } from "../controllers/LoginController.js";
import { Me } from "../controllers/MeController.js";
import auth from "../MiddleWares/auth.js";
import refresh from "../controllers/RefreshController.js";
import productController from "../controllers/productController.js";
import admin from "../MiddleWares/admin.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", Login);
router.get("/me", auth, Me);
router.post("/refresh", refresh);
router.post("/logout", auth, logout);

router.post("/products", [auth, admin], productController.store);
router.put("/products/:id", [auth, admin], productController.update);
router.get("/products/:id",auth,productController.getParticular)
router.get("/products", auth, productController.GetAll);
router.delete("/products/:id", auth, productController.Delete);

export default router;