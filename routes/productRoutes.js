import express from "express";
import Product from "../models/Product.js";

// Create the product router
const router = express.Router();

// POST /api/products - Create a new product
router.post("/", async (req, res) => {
    try {
        const product = await Product.create(req.body);

        return res.status(201).json(product);
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Failed to create product.",
        });
    }
});

export default router;
