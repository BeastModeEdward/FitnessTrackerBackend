const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10; //test
// database functions

// user functions
async function createUser({ username, password }) {
  const hashedPassword = bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      row: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password)
    VALUES ($1,$2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id ,username
    ;`,
      [username, hashedPassword]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try{
    const {row: [user]} = await client.query(`
    SELECT username, password
    FROM users
  `)
  return user
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
