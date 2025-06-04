import { assert } from "chai"; // Import Chai assertion library for test checks
import { testUser } from "../fixtures.js"; // Predefined test user object
import { ExplorerService } from "./ExplorerService.js"; // Service for interacting with the API

// tests related to the User API
describe("User API Tests", () => {
  let createdUser; // Store the test user created for each test

  // Before each test, first will start by clearing users and re-creating one
  beforeEach(async () => {
    await ExplorerService.deleteAllUsers(); // Clean slate

    // Create and authenticate the test user
    createdUser = await ExplorerService.createUser(testUser);
    const authData = await ExplorerService.authenticate(createdUser);
    ExplorerService.setAuthHeader(authData.token); // Attach token for secure routes
  });

  // Ensures user creation will return the expected user object
  it("create a user", async () => {
    assert.exists(createdUser); // Makes sure user was actually created
    assert.include(createdUser.email, "ludmila+"); // Checks for the test email pattern
  });

  // Confirms that a user can be authenticated and returns a valid JWT
  it("authenticate user", async () => {
    const authData = await ExplorerService.authenticate(createdUser);
    assert.exists(authData.token); // Token should exist in the response
  });

  // Try fetching a user with an invalid ID and expect 404
  it("get a user - bad id", async () => {
    try {
      await ExplorerService.getUser("0123456789abcdef01234567"); // Non-existent ID
      assert.fail("Should not find user with bad ID"); // If it doesn’t throw, test fails
    } catch (error) {
      assert.equal(error.response.status, 404); // It should return 404 Not Found
      assert.include(error.response.data.message, "No User with this id"); // Checks the error message
    }
  });

  // After all tests, will clean up by removing all users
  after(async () => {
    await ExplorerService.deleteAllUsers();
  });
});
