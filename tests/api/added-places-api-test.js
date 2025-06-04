import { assert } from "chai"; // Chai used for writing test assertions
import { ExplorerService } from "./ExplorerService.js"; // Test API service wrapper
import { testUser, testPoi } from "../fixtures.js"; // Sample test data

// Tests related to the (Added Places) API route
describe("Added Places API Tests", () => {
  let createdPoi; // Store the POI created in setup

  // Before running test, first it will register and log in the test user
  before(async () => {
    ExplorerService.clearAuth(); // will clear leftover token
    const createdUser = await ExplorerService.createUser(testUser); // Create a new user
    const authData = await ExplorerService.authenticate(createdUser); // Authenticate to get token
    ExplorerService.setAuthHeader(authData.token); // Apply token to all future requests
  });

  // Before running test, will clear existing POIs and create a new one
  beforeEach(async () => {
    await ExplorerService.deleteAllPois(); // Clean the POI database

    createdPoi = await ExplorerService.createPoi(testPoi); // Add a fresh POI for testing
  });

  // Test: will retrieve a specific POI through the (added places) API
  it("get an added place by ID", async () => {
    const result = await ExplorerService.getAddedPlace(createdPoi._id);
    assert.exists(result);
    assert.equal(result.name, testPoi.name);
    assert.equal(result.category, testPoi.category);
  });
});
