import Joi from "joi"; // Import Joi for schema-based validation

// Define schema for user signup form
export const UserSpec = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "First Name is required!", // Shown if field is empty
    "string.min": "First Name should have at least 3 characters!", // Too short
    "string.max": "First Name should not exceed 30 characters!", // Too short
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Last Name is required!",
    "string.min": "Last Name should have at least 3 characters!",
    "string.max": "Last Name should not exceed 30 characters!",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!", // Missing input
    "string.email": "Invalid email format!", // Missing input
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required!", // Missing input
    "string.min": "Password should have at least 6 characters!", // Missing input
  }),
});

// Define schema for user login form
export const UserCredentialsSpec = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!", // No email entered
    "string.email": "Invalid email format!", // Wrong format
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required!", // Missing password field
  }),
});
