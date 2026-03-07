import express from "express";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// Add your routes here
// Example:
// import productRoutes from './productRoutes.js';
// import userRoutes from './userRoutes.js';
// router.use('/products', productRoutes);
// router.use('/users', userRoutes);

export default router;
