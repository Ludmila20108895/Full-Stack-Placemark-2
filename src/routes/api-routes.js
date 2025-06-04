import Joi from "joi"; // Import Joi for schema-based input validation
import { userApi } from "../controllers/api/user-api.js"; // Import User API controller functions
import { poiApi } from "../controllers/api/poi-api.js"; // Import POI API controller functions
import { UserSpec, PoiSpec, UserCredentialsSpec } from "../models/joi-schemas.js"; // Import validation schemas

const idParam = Joi.object({
  id: Joi.string().required().description("MongoDB ObjectId"), // Validate ID parameter
});

export const apiRoutes = [
  // User API routes (For signup, login, fetching user info, deleting users)
  {
    method: "GET", // Get all users
    path: "/api/users",
    config: {
      auth: false,
      tags: ["api", "users"],
      description: "Get all users",
      notes: "Returns a list of all registered users",
      handler: userApi.find, // Calls the find method from userApi
    },
  },

  {
    method: "POST", // Create a new user
    path: "/api/users", // Create a new user
    config: {
      auth: false, // Public route (Auth strategy, UI = cookies)
      tags: ["api", "users"],
      description: "Create a new user",
      validate: {
        payload: UserSpec, // Validate request payload against UserSpec schema
      },
      notes: "Registers a new user with firstName, lastName, email and password",
      handler: userApi.create, // Calls the create method from userApi
    },
  },
  {
    method: "POST", // Authenticate a user
    path: "/api/users/authenticate", // Login/authenticate a user
    config: {
      auth: false,
      tags: ["api", "users"], // Tags for Swagger documentation
      description: "Authenticate a user",
      notes: "Logs in user and returns JWT token",
      validate: {
        payload: UserCredentialsSpec, // Validate request payload against UserCredentialsSpec schema
        failAction: (_request, _h, error) => {
          throw error; // If validation fails, throw an error
        },
      },
      handler: userApi.authenticate, // Calls the authenticate method from userApi
    },
  },

  {
    method: "DELETE", // Delete all users (for admin/testing)
    path: "/api/users", // Delete all users (for admin/testing)
    config: {
      auth: false,
      tags: ["api", "users"],
      description: "Delete all users",
      notes: "Removes all users from the database",
      handler: userApi.deleteAll, // Calls the deleteAll method from userApi
    },
  },
  {
    method: "GET", // Get user by ID
    path: "/api/users/{id}", // Get user by ID
    config: {
      auth: false,
      tags: ["api", "users"],
      description: "Get user by ID",
      notes: "Returns a user object based on MongoDB ID",
      validate: {
        params: idParam, // Validate request parameters against idParam schema
      },
      handler: userApi.getById, // Calls the getById method from userApi
    },
  },
  {
    method: "DELETE", // Delete a user by ID
    path: "/api/users/{id}", // Delete a user by ID
    config: {
      auth: false, // Public route (Auth strategy, UI = cookies)
      tags: ["api", "users"],
      description: "Delete a user by ID",
      notes: "Deletes a user and their data",
      validate: {
        params: idParam, // Validate request parameters against idParam schema
      },
      handler: userApi.delete, // Calls the delete method from userApi
    },
  },

  // POI Endpoints (Full CRUD access + image upload)
  {
    method: "GET", // Get all POIs
    path: "/api/pois", // Get all POIs
    config: {
      auth: { mode: "try", strategy: "jwt" }, // Try to authenticate with JWT, but don't fail if it doesn't exist
      tags: ["api", "pois"], // Tags for Swagger documentation
      description: "Get all POIs (TEMPORARY PUBLIC ACCESS)", // Description for Swagger
      notes: "Returns all Points of Interest (POIs) from all users", // Notes for Swagger
      validate: {
        query: Joi.object({
          category: Joi.string().valid("Caves", "Beaches", "Mountains", "Parks", "Waterfalls", "Cities").optional(),
        }),
      },
      handler: poiApi.getAll, // Calls the getAll method from poiApi
    },
  },
  {
    method: "POST", // Create a new POI
    path: "/api/pois", // Add a new POI
    config: {
      auth: "jwt", // Requires JWT auth. (Auth strategy, API = JWTs )
      tags: ["api", "pois"],
      description: "Create a new Point Of Interest",
      notes: "Requires name, category, lat/lng, and visit date",
      validate: {
        payload: PoiSpec, // Validate request payload against PoiSpec schema
        failAction: (_request, _h, error) => {
          // If validation fails, throw an error
          throw error;
        },
      },
      handler: poiApi.create, // Calls the create method from poiApi
    },
  },
  {
    method: "DELETE", // Delete all POIs (admin/testing)
    path: "/api/pois", // Delete all POIs (admin/testing)
    config: {
      auth: "jwt",
      tags: ["api", "pois"],
      description: "Delete all POIs",
      notes: "Remove all Points of Interest",
      validate: {
        query: Joi.object({
          category: Joi.string().valid("Caves", "Beaches", "Mountains", "Parks", "Waterfalls", "Cities").optional(),
        }),
      },
      handler: poiApi.deleteAll, // Calls the deleteAll method from poiApi
    },
  },

  {
    method: "GET", // Get a POI by ID
    path: "/api/pois/{id}", // Get POI by ID
    config: {
      auth: "jwt", // Requires JWT authentication
      tags: ["api", "pois"],
      description: "Get POI by ID",
      notes: "Returns Point of Interest using its ID",
      validate: {
        params: idParam, // Validate request parameters against idParam schema
      },

      handler: poiApi.getById, // Calls the getById method from poiApi
    },
  },
  {
    method: "DELETE", // Delete a POI by ID
    path: "/api/pois/{id}", // Delete a POI by ID
    config: {
      auth: "jwt",
      tags: ["api", "pois"], // Tag for POI operations
      description: "Delete POI by ID",
      notes: "Requires JWT. Deletes a POI record from the database",
      validate: {
        params: idParam, // Validate request parameters against idParam schema
      },
      handler: poiApi.delete, // Calls the delete method from poiApi
    },
  },

  {
    method: "GET", // Get added places by user ID
    path: "/api/added-places/{id}", // View a user-specific POI
    config: {
      auth: "jwt",
      tags: ["api", "pois"],
      description: "Get added place by user ID",
      notes: "Returns POIs added by a specific user",
      validate: {
        params: idParam, // Validate request parameters against idParam schema
      },
      handler: poiApi.getAddedPlace, // Calls the getAddedPlace method from poiApi
    },
  },
  {
    method: "POST", // Upload an image to a POI
    path: "/api/pois/{id}/upload", // Upload image(s) for a POI
    config: {
      auth: "jwt",
      tags: ["api", "images"],
      description: "Upload an image to a POI (added place)",
      notes: "Uploads an image to Cloudinary and associates it with the specified POI.",
      validate: {
        params: Joi.object({
          id: Joi.string().required().description("POI ID (MongoDB ObjectId)"),
        }),
        payload: Joi.object({
          image: Joi.any()
            .meta({ swaggerType: "file" })
            .required()
            .description("Image file to upload (JPG, PNG, etc.)"),
        }),
        failAction: (_request, _h, error) => {
          throw error;
        },
      },
      payload: {
        maxBytes: 20 * 1024 * 1024, // 20MB limit
        output: "stream",
        parse: true,
        multipart: true,
        allow: "multipart/form-data",
      },
      response: {
        status: {
          200: Joi.object({
            _id: Joi.string(),
            name: Joi.string(),
            visitDate: Joi.date(),
            category: Joi.string(),
            latitude: Joi.number(),
            longitude: Joi.number(),
            images: Joi.array().items(Joi.string().uri()),
            createdBy: Joi.string(),
          }).label("UpdatedPOI"),
        },
      },
      handler: poiApi.uploadImage, // Calls the uploadImage method from poiApi
    },
  },
  {
    method: "POST",
    path: "/api/users/{id}/favourites/{poiId}",
    config: {
      auth: "jwt",
      tags: ["api", "users"],
      description: "Toggle favourite POI for user",
      handler: userApi.toggleFavourite,
    },
  },
  {
    method: "GET",
    path: "/api/users/{id}/favourites",
    config: {
      auth: "jwt",
      tags: ["api", "users"],
      description: "Get all favourite POIs for user",
      handler: userApi.getFavourites,
    },
  },
];
