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

// ✅ Allowed origins for CORS (dev + production)
const allowedOrigins = [
  "http://localhost:5173",                 // local dev
  "https://bistro-ease-njs6.vercel.app"   // production (Vercel)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools (like Postman) that send no origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you send cookies/auth headers
  })
);

app.use(express.json());

// ✅ Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/dishes", dishRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", UserRoutes);      
app.use("/api/admin/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);

export default app;
