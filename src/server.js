// Dependencies
import fs from "fs"; // File system module for reading files
import moment from "moment"; // Used for formatting dates
import mongoose from "mongoose"; // MongoDB object modeling
import Hapi from "@hapi/hapi"; // Web framework
import Vision from "@hapi/vision"; // Template rendering support (like Handlebars)
import Inert from "@hapi/inert"; // Serving static files (images, CSS, etc.)
import Cookie from "@hapi/cookie"; // For cookie-based sessions
import HapiAuthJWT from "hapi-auth-jwt2"; // JWT auth plugin
import dotenv from "dotenv"; // Loads environment variables
import Handlebars from "handlebars"; // Templating engine
import Path from "path"; // Handles file paths
import HapiSwagger from "hapi-swagger"; // Swagger plugin for API docs

// Internal modules
import { allRoutes } from "./routes/routes.js"; // View-related routes (for example: /pois, /login)
import { apiRoutes } from "./routes/api-routes.js"; // Routes for API endpoints (for example: /api/pois)
import { User } from "./models/mongo/user-model.js"; // MongoDB user model
import { validate } from "./utils/jwt-utils.js"; // JWT validation function

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8")); // Read package.json to get version info

dotenv.config(); // will load  environment variables from .env file

// Will create the Hapi server instance
const server = Hapi.server({
  port: process.env.PORT || 3000, // Port to listen on (default: 3000)
  host: "localhost",
  routes: {
    files: {
      relativeTo: Path.join(process.cwd(), "public"), // Serve static files from /public
    },
  },
});
server.ext("onRequest", (request, h) => {
  console.log(`[${new Date().toISOString()}] ${request.method.toUpperCase()} ${request.path}`); // Log incoming requests
  return h.continue;
});

async function init() {
  // Main function to initialize the server
  try {
    // Register plugins for serving static files, rendering templates, and handling JWT authentication
    await server.register([
      Inert, // For serving static files
      Vision, // For rendering templates
      Cookie, // For cookie-based sessions
      HapiAuthJWT, // JWT authentication plugin
      {
        plugin: HapiSwagger, // Swagger plugin for API documentation
        options: {
          info: {
            title: "Explorer API Documentation", // Title of the API
            version: pkg.version, // Version from package.json
          },
          grouping: "tags", // Group endpoints by tags
          documentationPage: true, // Show documentation page
          documentationPath: "/documentation", // URL for the documentation page
          securityDefinitions: {
            jwt: {
              type: "apiKey", // Type of security definition
              name: "Authorization", // Name of the header to send the token
              in: "header", // Location of the token
            },
          },
          security: [{ jwt: [] }], // Apply JWT security to all endpoints
        },
      },
    ]);
    // Register the Swagger plugin for API documentation

    // Configure JWT authentication (used for API routes)
    server.auth.strategy("jwt", "jwt", {
      key: process.env.JWT_SECRET, // Secret key from .env
      validate, // Function to validate the JWT
      verifyOptions: { algorithms: ["HS256"] },
    });

    // Cookie-based session auth (used for browser-based UI routes)
    server.auth.strategy("session", "cookie", {
      cookie: {
        name: process.env.COOKIE_NAME,
        password: process.env.COOKIE_PASSWORD,
        isSecure: false, // Should be true in production with HTTPS
      },
      redirectTo: "/login", // Redirect if not logged in
      validate: async (_request, session) => {
        try {
          const user = await User.findById(session.id); // Check if user still exists
          return { isValid: !!user, credentials: user };
        } catch (error) {
          console.error(" Session validation error:", error);
          return { isValid: false };
        }
      },
    });

    // Set "session" auth as default for all routes, but allow unauthenticated access ("try" mode)
    server.auth.default({
      strategy: "session",
      mode: "try",
    });

    // Configures Handlebars as the view engine
    server.views({
      engines: { hbs: Handlebars }, // Use Handlebars for .hbs files
      relativeTo: Path.resolve("src"), // Base path for views
      path: "views", // Directory for page templates
      layout: "layout", // Default layout to use (views/layouts/layout.hbs)
      layoutPath: "views/layouts", // Layouts directory
      partialsPath: "views/partials", // Directory for reusable template chunks
    });

    // Register all app routes (UI + API)
    server.route([...allRoutes, ...apiRoutes]);

    // Optional: Log all routes to the console (I used for debugging)
    // console.log("Routes loaded:"); [...allRoutes, ...apiRoutes].forEach((r) => console.log(`- ${r.method} ${r.path}`));

    // Serve static images from /public/images via URL: /images/filename
    server.route({
      method: "GET",
      path: "/images/{file*}",
      handler: {
        directory: {
          path: Path.join(process.cwd(), "public/images"),
          listing: false, // Don't show directory listing
        },
      },
      options: { auth: false }, // Publicly accessible
    });
    // Serve custom scripts like /scripts/map.js and /scripts/chart.js
    server.route({
      method: "GET",
      path: "/scripts/{param*}",
      handler: {
        directory: {
          path: Path.join(process.cwd(), "public/scripts"), // Serve from public/scripts
          listing: false, // Don't show directory listing
        },
      },
      options: { auth: false }, // Publicly accessible
    });

    // Serve uploaded images from /uploads via URL: /uploads/filename
    server.route({
      method: "GET",
      path: "/uploads/{param*}",
      handler: {
        directory: {
          path: Path.join(process.cwd(), "uploads"),
          listing: false,
        },
      },
      options: { auth: false },
    });

    // Register a custom helper in Handlebars to format dates in templates
    Handlebars.registerHelper("formatDate", (dateString) => {
      if (!dateString) return "Unknown Date";
      return moment(dateString, ["YYYY-MM-DD", "DD-MM-YYYY", moment.ISO_8601]).format("DD-MM-YYYY");
    });

    Handlebars.registerHelper("json", (context) => JSON.stringify(context));

    // Register a helper to URL-encode strings for use in routes/queries
    Handlebars.registerHelper("encodeURIComponent", (value) => encodeURIComponent(value));

    // Start the Hapi server
    await server.start();
    console.log(` Server running at ${server.info.uri}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the app if something goes wrong
  }
}

// Catch unhandled Promise rejections (good practice)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

init(); // Initialize the app
