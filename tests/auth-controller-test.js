import { assert } from "chai"; // Chai for writing test assertions
import { testUser } from "./fixtures.js"; // Reusable dummy user data
import { ExplorerService } from "./api/ExplorerService.js"; // API helper for creating and logging in users

// Tests for the authentication flow (signup + login)
describe("Auth Controller Tests", () => {
  // before tests will start running...
  before(async () => {
    ExplorerService.clearAuth(); // ...Clears any existing auth token
  });

  // Before each testruns, will delete all users to keep test state clean
  beforeEach(async () => {
    await ExplorerService.deleteAllUsers(); // Reset user collection
  });

  //  This Test will create a user and signup + login both work and return a valid token
  it("sign up and login", async () => {
    const createdUser = await ExplorerService.createUser(testUser); // it will get the actual email used
    const loginCreds = {
      email: createdUser.email,
      password: testUser.password,
    };
    const result = await ExplorerService.authenticate(loginCreds); // should match the DB records

    assert.exists(result.token); // A token should be returned
    assert.isString(result.token); // The token should be a string

    ExplorerService.setAuthHeader(result.token); // Set it for future requests
  });
});
