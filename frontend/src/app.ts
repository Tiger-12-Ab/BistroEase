import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes";
import heroRoutes from "./routes/heroRoutes";
import dishRoutes from "./routes/dishRoutes"; 
import reviewRoutes from "./routes/reviewRoutes";
import UserRoutes from "./routes/userRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import adminOrderRoutes from "./routes/adminOrderRoutes";


const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,               
}));

app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/dishes", dishRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", UserRoutes);      
app.use("/api/admin/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);

export default app;
