import mongoose from "mongoose"; // Import Mongoose to define schemas and models
import moment from "moment"; // Import Moment.js to format date values

const poiSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the place (e.g., "Eiffel Tower")
  category: { type: String, required: true }, // Type/category of POI (e.g., "Mountains", "City")
  visitDate: { type: Date, required: true }, /// Date the user visited this place
  images: [{ type: String }], // Array of image filenames or URLs
  latitude: { type: Number, required: true }, // Geographic latitude (for map display)
  longitude: { type: Number, required: true }, // Geographic longitude (for map display)

  // Reference to the user who added this POI
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Stores the User's MongoDB ID
    ref: "User", // Links to the User model
    required: true,
  },
});

// Add a method to the schema to return a formatted version of visitDate
poiSchema.methods.formatVisitDate = function () {
  return moment(this.visitDate).format("DD-MM-YYYY");
};

// Create the Mongoose model for POIs - (This lets us interact with the 'pois' collection)

export const Poi = mongoose.model("Poi", poiSchema);
