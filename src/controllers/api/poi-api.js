import Boom from "@hapi/boom"; // Import Boom for standardized HTTP error responses
import { v4 as uuidv4 } from "uuid"; // UUID library for generating unique IDs
import fs from "fs"; // File system module for file handling
import Path from "path"; // Path module for file handling
import cloudinary from "../../utils/cloudinary.js"; // Import Cloudinary for image uploads
import { Poi } from "../../models/mongo/poi-model.js"; // Import the POI model from MongoDB

// Export all API route handlers for POI-related operations
export const poiApi = {
  // Create a new POI (POST /api/pois)
  async create(request, h) {
    try {
      const userId = request.auth?.credentials?._id;
      if (!userId) return Boom.unauthorized("You must be logged in to create a POI"); // Return 401 if user is not authenticated

      const poi = new Poi({
        name: request.payload.name,
        visitDate: new Date(request.payload.visitDate),
        category: request.payload.category,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        createdBy: userId,
        images: [],
      });

      const savedPoi = await poi.save(); // Save updated POI document to the database
      return h.response(savedPoi).code(201); // Send a structured HTTP response (New resource successfully created)
    } catch (err) {
      console.error("Error creating POI:", err);
      return Boom.badImplementation("Failed to create POI"); // Return 500 Internal Server Error – Unexpected error on the server
    }
  },

  // Retrieve all POIs (GET /api/pois)
  async getAll(_request, _h) {
    const pois = await Poi.find().lean(); // Query the POI collection in MongoDB
    return pois;
  },

  // Get a specific POI by ID (GET /api/pois/:id)
  async getById(request, h) {
    const poi = await Poi.findById(request.params.id).lean(); // Query the POI collection in MongoDB
    if (!poi) return h.response({ error: "POI not found" }).code(404); //  HTTP response (Resource doesn't exist)
    return h.response(poi).code(200); //  HTTP response (Request was successful)
  },

  // Delete a single POI by ID (DELETE /api/pois/:id)
  async delete(request, h) {
    const poi = await Poi.findByIdAndDelete(request.params.id); // Query the POI collection in MongoDB
    if (!poi) return h.response({ error: "POI not found" }).code(404); //  HTTP response (Resource doesn't exist)
    return h.response().code(204); // HTTP response (Request succeeded, no response/returned)
  },

  // Delete all POIs from the database (DELETE /api/pois)
  async deleteAll(_req, h) {
    await Poi.deleteMany({}); // Remove all POI documents from the database
    return h.response().code(204); //  HTTP response (Request succeeded, no response/returned
  },
  // Get a specific "added place" POI (GET /api/added-places/:id)
  async getAddedPlace(request, h) {
    const poi = await Poi.findById(request.params.id).lean(); // Query the POI collection in MongoDB
    if (!poi) return h.response({ error: " Place not found" }).code(404); //  HTTP response (Resource doesn't exist)
    return h.response(poi).code(200); // Send a structured HTTP response (Request was successful)
  },

  // Add one or more images to a POI (POST /api/pois/:id/upload)
  async uploadImage(request, h) {
    try {
      const poi = await Poi.findById(request.params.id); // Find the POI by ID
      if (!poi) {
        // If POI not found, return 404
        return h.response({ error: "POI not found" }).code(404);
      }

      const images = request.payload.image;
      const files = Array.isArray(images) ? images : [images];

      const uploadImageToCloudinary = async (file) => {
        if (!file?.hapi?.filename) return;

        const { filename, headers } = file.hapi;
        const contentType = headers["content-type"] || "";
        if (!contentType.startsWith("image/")) return;

        const uniqueName = `${uuidv4()}-${filename}`;
        const tempPath = Path.join("uploads", uniqueName);

        const fileStream = fs.createWriteStream(tempPath);
        await new Promise((resolve, reject) => {
          file.pipe(fileStream);
          file.on("end", resolve);
          file.on("error", reject);
        });

        const result = await cloudinary.uploader.upload(tempPath, {
          folder: "pois-images",
        });

        await fs.promises.unlink(tempPath); // Clean up temp file

        if (result.secure_url) {
          poi.images.push(result.secure_url);
        }
      };

      await Promise.all(files.map(uploadImageToCloudinary));
      await poi.save();

      return h.response({ message: "Images uploaded successfully", images: poi.images }).code(200);
    } catch (err) {
      console.error("Upload error:", err);
      return Boom.badImplementation("Failed to upload image(s)");
    }
  },
};
