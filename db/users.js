const client = require("./client");
const bcrypt = require('bcrypt');
const SALT_COUNT = 5;
const SALT_COUNT = 10; //test
// database functions

// user functions
async function createUser({ username, password }) {
  const hashedPassword = bcrypt.hash(password, SALT_COUNT);

  try {
    const {row: [user]} = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1,$2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id ,username
    ;`,[username, hashedpassword]);
    return user;
   } catch(error){
    throw error;
   }
}
//userscommit
async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
