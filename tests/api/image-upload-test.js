import { assert } from "chai"; // Chai for test assertions
import path from "path"; // Used to resolve the file path for the test image
import { ExplorerService } from "./ExplorerService.js"; // API helper service
import { testUser, testPoi } from "../fixtures.js"; // Sample user and POI data

// Test confirms API can accept image uploads
describe("Image Upload Tests", () => {
  let createdPoi; // Will store the POI we'll upload images to

  // Before all tests, first will create and authenticate a test user
  before(async () => {
    ExplorerService.clearAuth(); // Makes sure token is reset
    const createdUser = await ExplorerService.createUser(testUser);
    const authData = await ExplorerService.authenticate(createdUser);
    ExplorerService.setAuthHeader(authData.token); // Attach JWT to future requests
  });

  // Will clear POIs and create a fresh one
  beforeEach(async () => {
    await ExplorerService.deleteAllPois(); // clear POIs
    createdPoi = await ExplorerService.createPoi(testPoi); // create a fresh one
  });

  // Test will upload an image to a POI
  it("upload image to selected POI", async () => {
    const filePath = path.resolve("uploads/test-image.jpg"); // Path to mock image file
    const response = await ExplorerService.uploadImageToPoi(createdPoi._id, filePath); // Upload call
    assert.equal(response.status, 200); // Expect  response
    assert.isArray(response.data.images); // Response should have an image array
    assert.isNotEmpty(response.data.images); // Array should contain at least one item
  });

  // Test for image if appears in POI(added-places) data after upload
  it("uploaded image is saved to POI", async () => {
    const filePath = path.resolve("uploads/test-image.jpg");
    await ExplorerService.uploadImageToPoi(createdPoi._id, filePath); // Perform upload

    const updatedPoi = await ExplorerService.getPoiById(createdPoi._id); // Fetch updated POI
    assert.isArray(updatedPoi.images); // Images array should exist
    assert.isAtLeast(updatedPoi.images.length, 1); // and should contain one or more images
  });
});
