// Import controllers that handle logic for auth and dashboard
import { authController } from "../controllers/auth-controller.js";
import { dashboardController } from "../controllers/dashboard-controller.js";

// Import additional POI-related routes (defined in a separate file)
import { poiRoutes } from "./poi-routes.js";
import { UserCredentialsSpec } from "../models/joi-schemas.js";

// Main route definitions
export const routes = [
  {
    method: "GET",
    path: "/", // Home page
    options: { auth: false },
    handler: dashboardController.index,
  },
  {
    method: "GET",
    path: "/login", // Show login form
    options: { auth: false },
    handler: authController.showLogin,
  },
  {
    method: "POST", // Handle login form submission
    path: "/login", // Handle login form submission
    options: {
      auth: false, // Allow unauthenticated access
      validate: {
        payload: UserCredentialsSpec, // Validate user credentials
        failAction: (_request, h, error) => {
          h.view("login", {
            errors: error.details.map((e) => ({ message: e.message })), // Show validation errors
          }).takeover(); // Stop processing and show errors
        },
      }, // Validate user credentials
    },
    handler: authController.login, // Authenticate user
  },

  {
    method: "GET",
    path: "/signup", // Show signup form
    options: { auth: false }, // Allow unauthenticated access
    handler: authController.showSignup, // Render signup page
  },
  {
    method: "POST", // Handle signup form submission
    path: "/signup", // Handle signup form submission
    options: { auth: false },
    handler: authController.signup, // Register new user
  },
  {
    method: "GET",
    path: "/logout", // Log the user out
    handler: authController.logout, // Logout user
  },
  {
    method: "GET", // Show user profile
    path: "/dashboard", // Authenticated user dashboard
    options: { auth: "session" }, //  Require login for dashboard
    handler: dashboardController.index, // Render dashboard page
  },
];
// Combine core routes with POI routes into a single list
export const allRoutes = [...routes, ...poiRoutes];
