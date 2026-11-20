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

// GET /api/products - Retrieve products with filtering and sorting
router.get("/", async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sortBy } = req.query;

        // Build the filter based on query parameters
        const filter = {};

        if (category) {
            filter.category = category;
        }

        // Filter products by minimum and maximum price
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                const minimum = Number(minPrice);

                if (!Number.isFinite(minimum) || minimum < 0) {
                    return res.status(400).json({
                        message: "minPrice must be a valid non-negative number.",
                    });
                }

                filter.price.$gte = minimum;
            }

            if (maxPrice !== undefined) {
                const maximum = Number(maxPrice);

                if (!Number.isFinite(maximum) || maximum < 0) {
                    return res.status(400).json({
                        message: "maxPrice must be a valid non-negative number.",
                    });
                }

                filter.price.$lte = maximum;
            }
        }

        // Set the sorting order
        const sort = {};

        if (sortBy === "price_asc") {
            sort.price = 1;
        } else if (sortBy === "price_desc") {
            sort.price = -1;
        } else if (sortBy !== undefined) {
            return res.status(400).json({
                message: "sortBy must be price_asc or price_desc.",
            });
        }

        const products = await Product.find(filter).sort(sort);

        return res.status(200).json(products);
    } catch (error) {
        console.error("Failed to retrieve products:", error.message);

        return res.status(500).json({
            message: "Failed to retrieve products.",
        });
    }
});

export default router;
