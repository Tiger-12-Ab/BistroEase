import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db";
import { sendEmail } from "../utils/sendEmail";

export const signup = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone, address, password } = req.body;

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must have 1 uppercase, 1 number, 1 special character." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.execute(
      "INSERT INTO users (first_name,last_name,email,phone,address,password,otp,is_verified) VALUES (?,?,?,?,?,?,?,0)",
      [first_name, last_name, email, phone, address, hashedPassword, otp]
    );

    // Send OTP via email
    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

    res.status(200).json({ message: "Signup successful, check your email for OTP." });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Email already exists." });
    res.status(500).json({ message: err.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const [rows]: any = await db.execute("SELECT * FROM users WHERE email=? AND otp=?", [email, otp]);

  if (rows.length === 0) return res.status(400).json({ message: "Invalid OTP" });

  await db.execute("UPDATE users SET is_verified=1, otp=NULL WHERE email=?", [email]);
  res.status(200).json({ message: "Email verified successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const [rows]: any = await db.execute("SELECT * FROM users WHERE email=?", [email]);

  if (rows.length === 0) return res.status(400).json({ message: "Invalid email or password" });

  const user = rows[0];
  if (!user.is_verified) return res.status(400).json({ message: "Email not verified" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "30d" });

  res.status(200).json({
    token,
    role: user.role,
    user: {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
    },
  });
};

