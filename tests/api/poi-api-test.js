import { assert } from "chai"; // Import Chai assertion library for testing
import { ExplorerService } from "./ExplorerService.js"; // Reusable API helper service
import { testUser, testPoi } from "../fixtures.js"; // Test data: one user and one POI

// POI API-related tests
describe("POI API Tests", () => {
  let createdPoi; // Variable to hold the POI created in each test

  // Before any test runs, we create a user and authenticate
  before(async () => {
    ExplorerService.clearAuth(); // Clear any existing token/session
    const createdUser = await ExplorerService.createUser(testUser); // Create test user
    const authData = await ExplorerService.authenticate(createdUser); // Log in
    ExplorerService.setAuthHeader(authData.token); // Attach JWT token to all future requests
  });
  // Before each test, we clear all POIs and create a fresh one
  beforeEach(async () => {
    await ExplorerService.deleteAllPois(); // Reset POI collection
    createdPoi = await ExplorerService.createPoi(testPoi); // Add a test POI to work with
  });

  // Creating a POI should work and return matching data
  it("create a POI", async () => {
    assert.equal(createdPoi.name, testPoi.name); // Checks for name that matches input
    assert.equal(createdPoi.category, testPoi.category); // Check for category that matches input
  });
  //  Fetches  POI by ID Confirms that created POI can be retrieved
  it("fetch POI by ID", async () => {
    const poi = await ExplorerService.getPoiById(createdPoi._id); // Fetch by ID
    assert.exists(poi); // Make sure something was returned
    assert.equal(poi.name, testPoi.name); // Validate its contents
  });
  // Delete POI: Check deletion and 404 response afterward
  it("delete POI", async () => {
    await ExplorerService.deletePoi(createdPoi._id); // Delete by ID
    try {
      await ExplorerService.getPoiById(createdPoi._id); // Try to fetch it again
      assert.fail("POI should have been deleted"); // If no error, the test fails
    } catch (error) {
      assert.exists(error?.response); // There should be an error response
      assert.equal(error.response.status, 404); // Should return 404 Not Found
    }
  });
});
