import { v4 } from "uuid";

// eslint-disable-next-line import/no-unresolved
import { db } from "./store-utils.js";

export const userJsonStore = {
  async getAllUsers() {
    await db.read();
    return db.data?.users || []; //  Ensure users array exists
  },

  async addUser(user) {
    await db.read();
    user._id = v4();

    if (!db.data.users) db.data.users = []; //  Initialize users array if missing
    db.data.users.push(user);

    await db.write();
    return user;
  },

  async getUserById(id) {
    await db.read();
    return db.data?.users?.find((user) => user._id === id) || null; //  Return null if not found
  },

  async getUserByEmail(email) {
    await db.read();
    return db.data?.users?.find((user) => user.email === email) || null; //  Return null if not found
  },

  async deleteUserById(id) {
    await db.read();

    if (!db.data?.users) return false; //  Handle uninitialized DB

    const index = db.data.users.findIndex((user) => user._id === id);

    if (index === -1) return false; //  Prevent accidental removal of last item

    db.data.users.splice(index, 1);
    await db.write();
    return true; //  Indicate successful deletion
  },

  async deleteAll() {
    if (!db.data) db.data = {}; //  Ensure db.data exists
    db.data.users = [];
    await db.write();
  },
};
