import mongoose from "mongoose";

// Define the product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [Number.MIN_VALUE, "Price must be greater than 0"],
    },
    category: {
        type: String,
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    tags: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);

export default Product;
