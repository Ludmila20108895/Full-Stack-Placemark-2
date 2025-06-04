import Joi from "joi"; // Import Joi for schema-based input validation

// User Signup Validation Schema
export const UserSpec = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "First Name is required!", // when  User didn't type anything
    "string.min": "First Name must be at least 3 characters long.", // Too short
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Last Name is required!",
    "string.min": "Last Name must be at least 3 characters long.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!", // Missing input
    "string.email": "Invalid email format!", // Not a valid email
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required!", // No password entered
    "string.min": "Password should have at least 6 characters!", // Too weak
  }),
});

//  User Login Validation Schema
export const UserCredentialsSpec = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Invalid email format!",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required!",
  }),
});

//  POI (Point of Interest) Validation - **Includes Category**
export const PoiSpec = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Place name is required!",
    "string.min": "Place name should have at least 2 characters!",
    "string.max": "Place name should not exceed 100 characters!",
  }),
  category: Joi.string().valid("Caves", "Beaches", "Mountains", "Parks", "Waterfalls", "Cities").required().messages({
    "string.empty": "Category is required!",
    "any.only": "Invalid category! Choose from Caves, Beaches, Mountains, Parks, Waterfalls, Cities.",
    "string.base": "Category must be a string!",
  }),

  visitDate: Joi.date().iso().required().messages({
    "date.base": "Invalid date format! Use YYYY-MM-DD.",
    "any.required": "Visit date is required!",
  }),
  latitude: Joi.number().required().messages({
    "number.base": "Latitude must be a number!",
    "any.required": "Latitude is required!",
  }),
  longitude: Joi.number().required().messages({
    "number.base": "Longitude must be a number!",
    "any.required": "Longitude is required!",
  }),
});
