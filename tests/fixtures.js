import dotenv from "dotenv"; // Load environment variables (like API URL)

// Initialize dotenv so you can use process.env.*
dotenv.config();

export const serviceUrl = "http://localhost:3000"; // API base URL

// Dummy user account used in tests
export const testUser = {
  firstName: "Ludmila",
  lastName: "Bulat",
  email: `ludmila+${Date.now()}@example.com`, // this code makes sure each test run has a fresh email
  password: "password123456", // Simple test password
};

// Dummy POI used in tests
export const testPoi = {
  name: "Eiffel Tower", // Sample of place name added
  category: "City", // POI category (must match Joi spec)
  visitDate: "2024-03-20", // ISO format date for testing
  latitude: 48.8584,
  longitude: 2.2945, // Coordinates for map display
};
