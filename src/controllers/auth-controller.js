import bcrypt from "bcrypt"; // Import bcrypt for secure password hashing
import { User } from "../models/mongo/user-model.js"; // Import the User model from Mongoose
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js"; // Import Joi schemas for validation

// Export the controller methods to handle authentication
export const authController = {
  async showLogin(_request, h) {
    return h.view("login"); // Render the login.hbs template
  },
  // Handle user login and session creation
  async login(request, h) {
    try {
      const { error, value } = UserCredentialsSpec.validate(request.payload, { abortEarly: false }); // Validate form input with Joi
      if (error) {
        // Format errors for better UI display
        const formattedErrors = error.details.map((err) => ({
          message: err.message.replace(/"([^"]+)"/g, (_, key) => `"${key}"`),
        }));
        return h.view("login", { errors: formattedErrors }); // Render login view with error messages
      }

      const user = await User.findOne({ email: value.email }); // Search for user in DB by email
      // Compare entered password with hashed one
      if (!user || !(await bcrypt.compare(value.password, user.password))) {
        return h.view("login", { errors: [{ message: "Invalid email or password" }] }); // Show invalid credentials
      }

      request.cookieAuth.set({ id: user._id }); // Set a session cookie with the user ID

      // Redirect users to the POI page after login
      return h.redirect("/pois");
    } catch (error) {
      console.error("Login error:", error); // Log any unexpected error
      return h.view("login", { errors: [{ message: "Something went wrong, please try again." }] }); // Show general error
    }
  },
  // Show the signup form
  async showSignup(_request, h) {
    return h.view("signup"); // Render signup.hbs template
  },
  // Handle new user registration
  async signup(request, h) {
    try {
      const { error, value } = UserSpec.validate(request.payload, { abortEarly: false }); // Validate registration input
      if (error) {
        const formattedErrors = error.details.map((err) => ({
          message: err.message.replace(/"([^"]+)"/g, (_, key) => `"${key}"`),
        }));
        return h.view("signup", { errors: formattedErrors }); // Render signup with validation errors
      }

      const hashedPassword = await bcrypt.hash(value.password, 10); // Hash the user's password before saving
      const newUser = new User({ ...value, password: hashedPassword }); // Create a new user instance
      await newUser.save(); // Save user to MongoDB
      return h.redirect("/login"); // Redirect to login after successful registration
    } catch (error) {
      console.error("Signup error:", error); // Log signup error
      return h.view("signup", { errors: [{ message: "Could not create account. Try again!" }] }); // Show error message
    }
  },
  // Handle logout and clear session
  async logout(request, h) {
    request.cookieAuth.clear(); // Clear the session cookie
    return h.redirect("/"); // Redirect to homepage
  },
};
