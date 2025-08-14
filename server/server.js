import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDb from "./configs/db.js";
import "dotenv/config";
// import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

// dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

await connectDb();
await connectCloudinary();

// Alowed Multiple Origin
const allowedOrigin = ["http://localhost:5173"];
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use((req, res, next) => {
  console.log("Request path:", req.path);
  next();
});

app.get("/", (req, res) => res.send("Api is Working"));
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
