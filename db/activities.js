const client = require('./client');


// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try{
  const {rows: [activity]} = await client.query(`
  INSERT INTO activities(name, description)
  VALUES($1, $2)
  ON CONFLICT (name) DO NOTHING
  RETURNING *;
  `,[name, description]);
  return activity;
} catch(error){
  console.error(error)
}}

async function getAllActivities() {
  // select and return an array of all activities
  try{
    const {rows: activities}= await client.query(`
    SELECT *
    FROM activities;
    `);
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
    WHERE id=$1
    `,[id])
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
    `,[name])
    return activity;
  } catch(error){
    console.error(error)
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  const binds = routines.map( (routine, idx) =>{
    return "$"+ (idx+1)
  }).join(", ") //return $1, $2, $3...
  try{
    const {rows: activities } = await client.query(`
    SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
    FROM activities
    JOIN routine_activities
    ON routine_activities."activityId" = activities.id
    WHERE routine_activities."routineId"
    IN (${binds})
    `, routines.map( (routine) => routine.id) //return list of id's
    )
    // activties is a list of all activities that are on a routine in routines
    routines.forEach( (routine) =>{
      routine.activities = activities.filter( (activity) => routine.id === activity.routineId )
    })
    return routines;
  } catch(error){
    console.error(error)
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
).join(', ')
  try {
    const {rows:[activity] } = await client.query(`
  UPDATE activities
  SET ${setString}
  WHERE id=${id}
  RETURNING *
  `,Object.values(fields))
return activity;
}catch(error){
  console.error(error)
}

}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
