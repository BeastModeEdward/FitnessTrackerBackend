const client = require("./client");
//const {attachActivitiesToRoutines} = require('./activities')
//const {getUserByUsername} = require('./users')

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
  const {rows:[routine]} = await client.query(`
  INSERT INTO routines("creatorId", "isPublic", name, goal)
  VALUES($1,$2,$3,$4)
  RETURNING *;
  `,[creatorId, isPublic, name, goal]);
  return routine;
  } catch(error){
    console.error(error)
  }
}

async function getRoutineById(id) {
  try{
    const {row: [routine]} = await client.query(`
    SELECT * 
    FROM routines
    WHERE id=${id};
    `)
    return routine;
  } catch(error){
    console.error(error);
  }
}

async function getRoutinesWithoutActivities() {
  try{
    const {row: routines} = await client.query(`
    SELECT(id, "creatorId", "isPublic")
    FROM routines
    RETURNING(id, "creatorId", "isPublic");
    `)
    return routines;
  } catch(error){
    console.error(error);
  }
}

async function getAllRoutines() {
  try{
    const {row: [routine]} = await client.query(`
    SELECT * 
    FROM routines;
    `)
    return routine;
  } catch(error){
    console.error(error);
  }
}


async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
