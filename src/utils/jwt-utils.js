import jwt from "jsonwebtoken"; // JSON Web Token library for signing and verifying tokens
import dotenv from "dotenv"; // To load environment variables from a .env file
import { User } from "../models/mongo/user-model.js"; // Import User model to verify user existence

// Load environment variables (like JWT_SECRET)
dotenv.config();
// Create a JWT for the authenticated user
export function createToken(user) {
  const payload = { id: user._id, email: user.email }; // Info stored in the token
  const options = { algorithm: "HS256", expiresIn: "1h" }; // Token expires in 1 hour
  return jwt.sign(payload, process.env.JWT_SECRET, options); // Sign the token with secret
}
// Decode and verify a JWT
export function decodeToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Return the decoded token if valid
  } catch (err) {
    return null; // Return null if token is invalid or expired
  }
}
// Used by Hapi to validate incoming JWT tokens
export async function validate(decoded, _request) {
  const user = await User.findById(decoded.id).lean(); // Look up user by ID from decoded token
  return { isValid: !!user, credentials: user }; // Return if user exists and attach credentials
}
