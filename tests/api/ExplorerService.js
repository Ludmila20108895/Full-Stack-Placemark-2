import axios from "axios"; // Used for making HTTP requests to  API
import FormData from "form-data"; // Allows multipart form uploads (e.g. images)
import fs from "fs"; // Node's file system module to read image files

// Optional route imports (not used directly here)
import { poiRoutes } from "../../src/routes/poi-routes.js";
import { routes } from "../../src/routes/routes.js";

const baseUrl = "http://localhost:3000"; // Base URL for API calls during tests

// Shared service used in tests to call API endpoints
export const ExplorerService = {
  token: null, // Stores the JWT token once authenticated

  // Set token in Axios headers so all requests are authenticated
  setAuthHeader(token) {
    this.token = token;
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  // Clear token when starting fresh (e.g. before login)
  clearAuth() {
    this.token = null;
    delete axios.defaults.headers.common.Authorization;
  },

  // USER API METHODS

  // Create a new user with a unique email (adds a timestamp to prevent duplicates)
  async createUser(user) {
    const uniqueEmail = user.email.replace("@", `+${Date.now()}@`);
    const newUser = { ...user, email: uniqueEmail };
    const response = await axios.post(`${baseUrl}/api/users`, newUser);
    return response.data;
  },

  // Log in the user and store the token
  async authenticate(user) {
    const response = await axios.post(`${baseUrl}/api/users/authenticate`, user);
    console.log("Auth response data:", response.data);
    const token = response.data.token || response.data.user?.token;

    if (token) {
      this.setAuthHeader(token); // Store token for future requests
    }

    return response.data;
  },

  // Get a user by ID
  async getUser(id) {
    const response = await axios.get(`${baseUrl}/api/users/${id}`);
    return response.data;
  },

  // Delete a single user
  async deleteUser(id) {
    return axios.delete(`${baseUrl}/api/users/${id}`);
  },

  // Delete all users
  async deleteAllUsers() {
    return axios.delete(`${baseUrl}/api/users`);
  },

  // POI API METHODS

  // Create a new POI
  async createPoi(poi) {
    const response = await axios.post(`${baseUrl}/api/pois`, poi);
    return response.data;
  },

  // Fetch a POI by ID
  async getPoiById(id) {
    const response = await axios.get(`${baseUrl}/api/pois/${id}`);
    return response.data;
  },

  // Fetch all POIs
  async getAllPois() {
    const response = await axios.get(`${baseUrl}/api/pois`);
    return response.data;
  },

  // Delete a single POI
  async deletePoi(id) {
    return axios.delete(`${baseUrl}/api/pois/${id}`);
  },

  // Delete all POIs
  async deleteAllPois() {
    return axios.delete(`${baseUrl}/api/pois`);
  },

  // ADDITIONAL METHODS

  // Fetch a POI  page added-places (used in POI view)
  async getAddedPlace(id) {
    const response = await axios.get(`${baseUrl}/api/added-places/${id}`);
    return response.data;
  },

  // Upload an image to a POI using multipart form data
  async uploadImageToPoi(poiId, filePath) {
    const form = new FormData();
    form.append("images", fs.createReadStream(filePath)); // Read image from disk

    const response = await axios.post(`${baseUrl}/api/pois/${poiId}/upload`, form, {
      headers: form.getHeaders(), // Set correct headers for multipart upload
    });

    return response;
  },
};

// Merges routes arrays  (not used directly in tests)
export const allRoutes = [...routes, ...poiRoutes];
