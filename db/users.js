const client = require("./client");
const bcrypt = require("bcrypt")
=======
const SALT_COUNT = 10;

>>>>>>> 3ed7b1a1256eef43ad7b2e31599a385c26bb9fe8
// database functions

// user functions
async function createUser({ username, password }) {
  const hashedPassword = bcrypt.hash(password, SALT_COUNT);
  
  try {
    const {
      row: [user],
    } = await client.query(`
    INSERT INTO users(username, password) VALUES ($1,$2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id ,username
    `, [username, hashedPassword]);
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {


  if (!username || !password) {
    return;
3ed7b1a1256eef43ad7b2e31599a385c26bb9fe8
  }
}

async function getUserById(userId) {}

async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
