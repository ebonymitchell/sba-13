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


// PUT /api/products/:id - Update a product by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the MongoDB ObjectId
        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid product ID.",
            });
        }

        // Update the product and return the updated document
        const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        console.error("Failed to update product:", error.message);

        return res.status(500).json({
            message: "Failed to update product.",
        });
    }
});


// DELETE /api/products/:id - Delete a product by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the MongoDB ObjectId
        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid product ID.",
            });
        }

        // Find and delete the product
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error("Failed to delete product:", error.message);

        return res.status(500).json({
            message: "Failed to delete product.",
        });
    }
});


// GET /api/products - Retrieve all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json(products);
    } catch (error) {
        console.error("Failed to retrieve products:", error.message);

        return res.status(500).json({
            message: "Failed to retrieve products.",
        });
    }
});

export default router;
