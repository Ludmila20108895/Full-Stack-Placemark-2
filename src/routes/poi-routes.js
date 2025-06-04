// Import the controller that contains the logic for POI-related actions
import { poiController } from "../controllers/poi-controller.js";

import { PoiSpec } from "../models/joi-schemas.js";

// All routes for viewing, adding, uploading, and deleting POIs
export const poiRoutes = [
  { method: "GET", path: "/pois", handler: poiController.listPois }, // List all POIs
  { method: "GET", path: "/pois/add", handler: poiController.showAddPoiForm }, // Show form to add a new POI
  {
    method: "POST", // Handle form submission to add a new POI
    path: "/pois",
    options: {
      validate: {
        payload: PoiSpec, // Validate the payload against the PoiSpec schema
        failAction: (_request, h, error) => {
          h.view("add-poi", {
            errors: error.details.map((e) => ({ message: e.message })),
            isAuthenticated: true, // Show errors on the add POI form
          }).takeover(); // Stop processing and show errors
        },
      },
    },
    handler: poiController.addPoi,
  }, // Handle form submission to add a POI

  { method: "GET", path: "/pois/{id}", handler: poiController.showPoi }, // View details of a single POI

  { method: "POST", path: "/pois/delete/{id}", handler: poiController.deletePoi }, //  Delete  a POI
  { method: "GET", path: "/added-places/{id}", handler: poiController.showAddedPlaces }, // Show all POIs added by a user
  {
    method: "POST",
    path: "/pois/{id}/upload", // Upload image(s) for a POI
    handler: poiController.uploadImages,
    options: {
      payload: {
        output: "stream", // Stream for file uploads
        parse: true,
        multipart: true, // Accept multipart forms
        maxBytes: 20 * 1024 * 1024, // Max file size: 20MB
        allow: "multipart/form-data",
      },
      auth: {
        mode: "required",
        strategy: "session", // Require login for image uploads
      },
    },
  },
  {
    method: "GET",
    path: "/pois/{id}/images/{filename}/delete", // Delete an image for a POI
    handler: poiController.deleteImage,
    options: { auth: "session" },
  },
  // Add or remove a POI from the user's favourites
  {
    method: "POST",
    path: "/pois/{id}/favourite",
    options: {
      auth: {
        mode: "required",
        strategy: "session",
      },
    },
    handler: poiController.toggleFavourite,
  },

  // Display the current user's favourite POIs
  {
    method: "GET",
    path: "/favourites",
    options: {
      auth: {
        mode: "required",
        strategy: "session",
      },
    },
    handler: poiController.showFavourites,
  },
];
