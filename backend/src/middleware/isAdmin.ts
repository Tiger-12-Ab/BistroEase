// src/middleware/isAdmin.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader); // <-- log the token

    if (!authHeader) return res.status(401).json({ message: "Unauthorized: No token" });

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token); // <-- log the extracted token

    const secret = process.env.JWT_SECRET || "secretkey";
    const decoded: any = jwt.verify(token, secret);

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
