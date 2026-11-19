import express from "express";
import mongoose from "mongoose";
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

// GET /api/products/:id - Retrieve a product by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the MongoDB ObjectId
        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid product ID.",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error("Failed to retrieve product:", error.message);

        return res.status(500).json({
            message: "Failed to retrieve product.",
        });
    }
});

export default router;
