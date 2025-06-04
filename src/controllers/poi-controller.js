import moment from "moment"; // Import moment.js for date formatting
import fs from "fs"; // Import file system module for file handling
import Path from "path"; // Import path module for file handling
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating unique IDs
import { Poi } from "../models/mongo/poi-model.js"; // Import the POI model
import { PoiSpec } from "../models/joi-schemas.js"; // Import the Joi validation schema for POIs
import { User } from "../models/mongo/user-model.js"; // Import the User model
import cloudinary from "../utils/cloudinary.js"; // Import Cloudinary for image uploads

export const poiController = {
  async listPois(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login");
    return h.view("poi-list", { isAuthenticated: true });
  },

  async showAddPoiForm(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login");

    const category = request.query.category || "";
    const pois = await Poi.find({ category, createdBy: request.auth.credentials.id }).lean();

    pois.forEach((p) => {
      p.visitDate = moment(p.visitDate).format("DD-MM-YYYY");
    });

    return h.view("add-poi", { pois, category, isAuthenticated: true });
  },

  async addPoi(request, h) {
    try {
      if (!request.auth.isAuthenticated) return h.redirect("/login");

      const userId = request.auth.credentials.id;
      const { error, value } = PoiSpec.validate(request.payload, { abortEarly: false });

      if (error) {
        const pois = await Poi.find({ category: request.payload.category, createdBy: userId }).lean();
        return h.view("add-poi", { pois, errors: error.details, isAuthenticated: true });
      }

      const formattedDate = moment(value.visitDate, "YYYY-MM-DD").toDate();

      const newPoi = new Poi({
        name: value.name,
        visitDate: formattedDate,
        latitude: value.latitude,
        longitude: value.longitude,
        category: value.category,
        createdBy: userId,
        images: [],
      });

      await newPoi.save();

      const pois = await Poi.find({ category: request.payload.category, createdBy: userId }).lean();
      return h.view("add-poi", { pois, category: request.payload.category, isAuthenticated: true });
    } catch (err) {
      console.error("Error adding POI:", err);
      return h.view("add-poi", {
        error: "Could not add Point of Interest. Try again!",
        isAuthenticated: true,
      });
    }
  },

  async showPoi(request, h) {
    try {
      const poi = await Poi.findById(request.params.id).lean();
      if (!poi) {
        return h.view("added-places", { error: "POI not found!", isAuthenticated: true });
      }

      poi.visitDate = moment(poi.visitDate).format("DD-MM-YYYY");

      return h.view("added-places", {
        poi,
        isAuthenticated: true,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        visitDate: moment(poi.visitDate).format("DD-MM-YYYY"),
        title: `Photo Album - ${poi.name}`,
      });
    } catch (err) {
      console.error("Error loading POI:", err);
      return h.view("added-places", {
        error: "Could not load POI details!",
        isAuthenticated: true,
      });
    }
  },

  async uploadImages(request, h) {
    try {
      const poi = await Poi.findById(request.params.id);
      if (!poi) return h.response({ error: "POI not found" }).code(404);

      const { payload } = request;
      if (!payload || !payload.images) {
        return h.redirect(`/added-places/${poi._id}`);
      }

      const files = Array.isArray(payload.images) ? payload.images : [payload.images];
      const validFiles = files.filter(
        (file) => file && file.hapi && file.hapi.filename && file.hapi.headers["content-type"].startsWith("image/")
      );

      const uploadTasks = validFiles.map(async (file) => {
        const { filename } = file.hapi;
        const uniqueName = `${uuidv4()}-${filename}`;
        const tempPath = Path.join("uploads", uniqueName);

        // Save file to disk
        await new Promise((resolve, reject) => {
          const stream = fs.createWriteStream(tempPath);
          file.pipe(stream);
          file.on("end", resolve);
          file.on("error", reject);
        });

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(tempPath, { folder: "pois" });

        // Clean up local file
        await fs.promises.unlink(tempPath);

        return result.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadTasks);
      poi.images.push(...uploadedUrls);
      await poi.save();

      return h.redirect(`/added-places/${poi._id}`);
    } catch (error) {
      console.error("Image upload error:", error);
      return h.view("added-places", {
        error: "Failed to upload images",
        isAuthenticated: true,
      });
    }
  },

  async deleteImage(request, h) {
    try {
      const { id, filename } = request.params;
      const poi = await Poi.findById(id);
      if (!poi) return h.response("POI not found").code(404);

      poi.images = poi.images.filter((img) => !img.includes(filename));
      await poi.save();

      return h.redirect(`/added-places/${id}`);
    } catch (err) {
      console.error("Error deleting image:", err);
      return h.view("added-places", {
        error: "Failed to delete image",
        isAuthenticated: true,
      });
    }
  },

  async deletePoi(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login");

    const poi = await Poi.findByIdAndDelete(request.params.id);
    if (!poi) return h.view("poi-list", { error: "POI not found", isAuthenticated: true });

    return h.redirect(`/pois/add?category=${poi.category}`);
  },

  async showAddedPlaces(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login");

    const poi = await Poi.findById(request.params.id).lean();
    if (!poi) {
      return h.view("added-places", { error: "POI not found", isAuthenticated: true });
    }

    return h.view("added-places", {
      poi,
      isAuthenticated: true,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    });
  },
  async toggleFavourite(request, h) {
    const user = await User.findById(request.auth.credentials.id);
    const poiId = request.params.id;

    const index = user.favourites.indexOf(poiId);
    if (index > -1) {
      user.favourites.splice(index, 1); // Remove if exists
    } else {
      user.favourites.push(poiId); // Add if not
    }

    await user.save();
    const referrer = request.info.referrer || "/pois";
    return h.redirect(referrer);
  },

  async showFavourites(request, h) {
    const user = await User.findById(request.auth.credentials.id).populate("favourites").lean();

    // Format favourites to be plain JSON objects with no prototype issues
    const favourites = user.favourites.map((poi) => ({
      _id: poi._id.toString(),
      name: poi.name,
      category: poi.category,
      visitDate: poi.visitDate ? moment(poi.visitDate).format("DD-MM-YYYY") : "Unknown Date",
      latitude: poi.latitude,
      longitude: poi.longitude,
    }));

    return h.view("favourites-view", {
      title: "My Favourite Places",
      favourites,
      isAuthenticated: true,
      user: request.auth.credentials,
    });
  },
};
