import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import usersRouter from "./routes/users.router";
import productsRouter from "./routes/products.routes";
import orderRouter from "./routes/order.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("🚀 Backend H2DOR chạy OK!");
});

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", orderRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});