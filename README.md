# Full-Stack-Assignment-1

## Explorer Project

Explorer is a full-stack web application that allows users to sign up, log in, and manage their favorite places (Points of Interest). Users can create, update, delete, and categorize POIs, upload images, and see location of them on a map. The app includes JWT-authenticated APIs, a test , and clean UI built with Handlebars and Bulma CSS.

## In this Project I use ES Modules Instead of CommonJS

Throughout this project, I chose to use the ES Module system using ( import / export ) instead of the older CommonJS style (require / module.exports). This is why you will see (type: "module") defined in the package.json.

While in the lab I used CommonJS. I wanted to work with ES Modules because they are now the modern way to JavaScript and in Node.js (starting from version 14+ <https://nodejs.org/docs/latest-v13.x/api/esm.html> ). They are also more consistent with frontend JavaScript(in the browser),and easier to understand which uses the same (import/export) style.

Choosing ES Modules was a personal decision to challenge myself, to use more moders approach and build something that reflects development today. It also gave me a chance to practice working with newer tools and libraries.

I am comfortable working with both CommonJS and ES Modules, and I have used CommonJS in earlier labs.

## Features in my project

- User Signup & Login (with Cookies and JWT)
- Create / Read / Update / Delete POIs
- Categorize POIs by type (City, Beach, Cave, etc.)
- Upload and display images for POIs
- Google Maps integration for coordinates
- Admin Dashboard (basic user management)
- RESTful API (document-ready for Swagger)
- Joi-based form and API validation
- MongoDB models with Mongoose
- Full test coverage for models, controllers, and APIs

## Technologies Used

- **Node.js + Hapi** for the backend server
- **MongoDB + Mongoose** for data modeling
- **Handlebars (HBS)** for templating
- **Bulma CSS** for clean UI
- **JWT** for token-based API security
- **Joi** for input validation
- **Multer** for file/image uploads
- **Mocha + Chai** for testing

## Project Structure

src/
controllers/ # Page & API controllers
models/ # Mongoose + Joi schemas
routes/ # Route definitions (UI + API)
utils/ # JWT, upload helpers
validators/ # Joi validation schemas
views/ # Handlebars templates
tests/ # Unit & integration tests
public/ # Static assets

## Assignment Alignment

### - Joi Validation: (user-validator.js), (joi-schemas.js)

### - MongoDB Models: (user-model.js), (poi-model.js)

### - RESTful API: (api-routes.js), (user-api.js), (poi-api.js)

### - JWT Auth: (jwt-utils.js)

### - Swagger/OpenAPI ready structure

### - Admin Dashboard (in dashboard.hbs/controller)

### - Full test coverage (auth, POI, models, upload)

### - Deployment ready for Render:   https://explorer-app.onrender.com

## Getting Started

1. npm install

2. Configure .env file:

   JWT_SECRET=SecretKey
   MONGO_URL=mongodb://localhost/explorer

3. Run in dev mode:

npm run dev

## Running Tests

npm test
