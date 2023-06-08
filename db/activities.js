const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try{
  const {row: [activity]} = await client.query(`
  INSERT INTO activities(name, description)
  VALUES ($1, $2)
  ON CONFLICT (name) DO NOTHING
  RETURNING *;
  `,[name, description])
  return activity;
} catch(error){
  console.error(error)
}
}

async function getAllActivities() {
  // select and return an array of all activities
  try{
    const {rows: activities}= await client.query(`
    SELECT *
    FROM activities;
    `)
    return activities;
  } catch(error){
    console.error(error)
  }
}

async function getActivityById(id) {
  try{
    const {rows: [activity]} = await client.query(`
    SELECT *
    FROM activities
    WHERE id=${id}
    RETURNING *;
    `)
    return activity;
  } catch(error){
    console.error(error)
  }
}

async function getActivityByName(name) {
  try{
    const {rows: [activity]} = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1
    RETURNING *;
    `,[name])
    return activity;
  } catch(error){
    console.error(error)
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  try{
    const {rows: activities } = await client.query(`
    SELECT *
    FROM activities
    JOIN routines
    ON activities.id = routines.id
    `)
    return activities;
  } catch(error){
    console.error(error)
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
