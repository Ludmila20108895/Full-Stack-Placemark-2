import mongoose from "mongoose"; // Import Mongoose to define a MongoDB schema and model

// Define the structure of a User document using Mongoose Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // User's first name (required)
  lastName: { type: String, required: true }, // User's last name (required)
  email: { type: String, unique: true, required: true }, // Email must be unique and is required
  password: { type: String, required: true }, // Password is required
  //  Favourites field — references POIs
  favourites: [
    {
      // Array of favourite POIs
      type: mongoose.Schema.Types.ObjectId, // ObjectId type
      ref: "Poi", // Reference to the Placemark model (POI)
    },
  ],
});

// Create a User model from the schema and allows to perform DB operations like User.find()
export const User = mongoose.model("User", userSchema);
