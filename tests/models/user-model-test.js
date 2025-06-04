import { assert } from "chai"; // Chai for writing test assertions
import mongoose from "mongoose"; // Mongoose for DB interaction
import { User } from "../../src/models/mongo/user-model.js";

// tests for User model logic
describe("User Model Tests", () => {
  // Connect to MongoDB test database before any tests run
  before(async () => {
    await mongoose.connect("mongodb://localhost/explorer-test"); // we can change to use an in-memory DB too
  });

  // Clear the database before each test to prevent conflicts or duplicates
  beforeEach(async () => {
    await User.deleteMany(); // This deletes all users so each test starts fresh
  });

  // this will close the DB connection after all tests are done
  after(async () => {
    await mongoose.connection.close();
  });

  // This Test should successfully create and save a new user
  it("should create a new user document", async () => {
    const user = new User({
      firstName: "Ludmila",
      lastName: "Bulat",
      email: "ludmila@example.com",
      password: "securepass123", // In real app this should be hashed
    });

    const savedUser = await user.save(); // Save to MongoDB
    assert.exists(savedUser._id); // Mongo should generate an _id
    assert.equal(savedUser.email, "ludmila@example.com"); // Email should match input
  });
  // This Test should be able to delete a user by ID
  it("should delete a user document", async () => {
    const user = new User({
      firstName: "Ludmila",
      lastName: "Bulat",
      email: "ludmila2@example.com",
      password: "securepass123",
    });

    await user.save(); // Save the user to test deletion

    const result = await User.deleteOne({ _id: user._id }); // Delete by ID
    assert.equal(result.deletedCount, 1); // This code should confirm 1 user was deleted
  });
});
