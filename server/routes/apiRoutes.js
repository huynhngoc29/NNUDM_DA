import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import * as authController from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post(
  "/auth/register",
  validateRequest(registerSchema),
  authController.register,
);
router.post("/auth/login", validateRequest(loginSchema), authController.login);

//Product routes
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.get("/products/similar", productController.getSimilarProducts);
router.get("/get-product-by-slug/:slug", productController.getProductBySlug);
export default router;
