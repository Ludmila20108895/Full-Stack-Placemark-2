import Boom from "@hapi/boom"; // Import Boom for handling HTTP errors
import { User } from "../../models/mongo/user-model.js"; // Import the User model to interact with the MongoDB
import { Poi } from "../../models/mongo/poi-model.js"; // Import the POI model to interact with the MongoDB
import { createToken } from "../../utils/jwt-utils.js"; // Import helper function to generate JWT tokens

// Export all user-related API route handlers
export const userApi = {
  // Create a new user (POST /api/users)
  async create(request, h) {
    try {
      const user = new User(request.payload); // Create a new User instance using request payload
      const savedUser = await user.save();
      return h.response(savedUser).code(201); // HTTP response (User created successfully)
    } catch (err) {
      console.error(" User creation error:", err);
      return Boom.badImplementation("Could not create user"); // 500 Internal Server Error
    }
  },

  // Authenticate user and return a JWT (POST /api/users/authenticate)
  async authenticate(request, h) {
    const { email, password } = request.payload;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return Boom.unauthorized("Invalid email or password"); //  error 401 Unauthorized (Invalid login credentials)
    }

    console.log("Auth success:", user.email);

    // Generate a JWT token for the authenticated user
    const token = createToken(user); //
    return h.response({ success: true, token }).code(200); // return- Successfully authenticated
  },

  // Get user by ID (GET /api/users/:id)
  async getById(request, _h) {
    const user = await User.findById(request.params.id).lean();
    if (!user) return Boom.notFound("No User with this id"); // returns 404 Not Found (User with this ID does not exist)
    return user;
  },

  // Delete a user by ID (DELETE /api/users/:id)
  async delete(request, h) {
    const result = await User.findByIdAndDelete(request.params.id);
    if (!result) return Boom.notFound("User not found"); // returns  404 Not Found (User with this ID does not exist)
    return h.response().code(204); // returns HTTP response – Successfully deleted, no data returned
  },

  // Get all users (GET /api/users)
  async find(_req, h) {
    try {
      const users = await User.find().lean(); // Fetch all users from MongoDB
      return h.response(users).code(200); // Return the list of users
    } catch (error) {
      console.error("Error fetching users:", error);
      return Boom.badImplementation("Failed to fetch users"); // Error 500 if something goes wrong
    }
  },

  // Delete all users (for testing)
  async deleteAll(_req, h) {
    await User.deleteMany({});
    return h.response().code(204); // returns HTTP response – Successfully deleted, no data returned
  },
  async toggleFavourite(request, h) {
    const user = await User.findById(request.params.id);
    const { poiId } = request.params;

    if (!user) {
      return h.response({ error: "User not found" }).code(404);
    }

    const index = user.favourites.indexOf(poiId);
    if (index > -1) {
      user.favourites.splice(index, 1);
    } else {
      user.favourites.push(poiId);
    }

    await user.save();
    return h.response({ favourites: user.favourites }).code(200);
  },

  async getFavourites(request, h) {
    const user = await User.findById(request.params.id).populate("favourites");

    if (!user) {
      return h.response({ error: "User not found" }).code(404);
    }

    return h.response(user.favourites).code(200);
  },
};
