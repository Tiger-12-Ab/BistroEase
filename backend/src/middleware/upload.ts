// src/middleware/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Factory function to create multer upload middleware for a given folder.
 */
export const createUploader = (folder: string) => {
  const uploadPath = path.join(__dirname, `../../uploads/${folder}`);

  // ensure folder exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  return multer({ storage });
};
