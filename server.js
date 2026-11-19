import "dotenv/config";
import express from "express";
import connectDB from "./db/connection.js";
import productRoutes from "./routes/productRoutes.js";

// Create the Express application
const app = express();

// Enable JSON request bodies
app.use(express.json());

// Register product routes
app.use("/api/products", productRoutes);

// Define the server port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB before starting the server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error.message);
        process.exit(1);
    }
};

startServer();
