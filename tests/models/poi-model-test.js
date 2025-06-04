import { assert } from "chai"; // Chai assertion library for test validation
import mongoose from "mongoose"; // Mongoose for interacting with MongoDB
import { Poi } from "../../src/models/mongo/poi-model.js"; // Import the POI model

// tests related to the POI Mongoose model
describe("POI Model Tests", () => {
  // Before all tests, first will connect to a local MongoDB test database
  before(async () => {
    await mongoose.connect("mongodb://localhost/placemark-test"); // You can replace this with a test DB URI
  });

  // After we run tests, we will close the DB connection to clean up
  after(async () => {
    await mongoose.connection.close();
  });

  // This Test should be able to create and save a POI document
  it("should create a new POI document", async () => {
    const poi = new Poi({
      name: "Test Location",
      category: "City",
      visitDate: new Date("2023-03-20"), // Date field
      latitude: 40.7128,
      longitude: -74.006,
      createdBy: new mongoose.Types.ObjectId(), // it will simulate a user ID
    });

    const savedPoi = await poi.save(); // Save the document to MongoDB
    assert.exists(savedPoi._id); // Mongo should assign an ID
    assert.equal(savedPoi.name, "Test Location"); // Confirm name was saved correctly
  });

  // This test should be able to delete a POI document
  it("should delete a POI document", async () => {
    const poi = await Poi.findOne({ name: "Test Location" }); // Look up the POI by name
    const result = await Poi.deleteOne({ _id: poi._id }); // Delete it by ID
    assert.equal(result.deletedCount, 1); // Confirm that one document was deleted
  });
});
