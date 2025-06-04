


Full-Stack-Assignment-2
Explorer Project
Explorer is a full-stack web application where users can sign up, log in, and manage their favorite places (Points of Interest). Users can create, update, delete, categorize POIs, upload images (via Cloudinary), and view them on a map. The app includes secure JWT-authenticated APIs, an admin dashboard, robust validation, and a clean UI built with Handlebars and Bulma CSS.

This project represents my updated submission for Assignment 2, including enhanced features, better structure, and improved testing.

Key Features
 User Signup & Login (using Cookies and JWT)

 Create / Read / Update / Delete POIs

 Categorize POIs (City, Beach, Cave, etc.)

 Upload and display POI images via Cloudinary

 Google Maps integration for POI coordinates

 Admin Dashboard for managing users and data

 RESTful APIs with full test coverage

 Joi-based form and API validation

 MongoDB models using Mongoose

 Swagger/OpenAPI-ready structure

 Render deployment:
https://full-stack-placemark-2.onrender.com

Demo Login
Use the following credentials to test the app without registering:

Email: test@try.com

Password: Pass123456



Technologies Used
Node.js + Hapi – Backend server

MongoDB + Mongoose – Database and data modeling

Cloudinary – Cloud-based image upload and storage

Handlebars (HBS) – View templating

Bulma CSS – Clean and responsive UI

JWT – Token-based authentication

Joi – Input validation

Mocha + Chai – Testing framework
## Project Structure

Assignment 2 Alignment
Validation: user-validator.js, joi-schema.js

MongoDB Models: user-model.js, poi-model.js

RESTful APIs: user-api.js, poi-api.js, api-routes.js

JWT Authentication: jwt-utils.js

Cloudinary Image Storage: cloudinary.js + API integration

Admin Panel: Implemented in dashboard.hbs and controller

Testing: Full test coverage (auth, POIs, models, uploads)

Swagger-ready: Project structure supports OpenAPI documentation


1. npm install

2. Create a .env file with:
JWT_SECRET=yourSecretKey
MONGO_URL=mongodb://localhost/explorer
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


3. Run in dev mode:

npm run dev

## Running Tests

npm test
