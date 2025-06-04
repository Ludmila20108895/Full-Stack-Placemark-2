import multer from "multer"; // Import Multer, a middleware for handling multipart/form-data (file uploads)
import path from "path"; // Node.js path module to manage file extensions and paths

// Define storage engine for handling image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/uploads/"); // Save images in /public/uploads directory
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Filter to allow only image files
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type! Only images allowed."), false); // Reject non-images
  }
};
// Export a configured multer instance with custom storage and file filter
export const upload = multer({ storage, fileFilter });
