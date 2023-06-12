const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

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
    WHERE id=$1;
    `,[id])
    return routine;
  } catch(error){
    console.error(error);
  }
}

async function getRoutinesWithoutActivities() {
  try{
    const {rows: routines} = await client.query(`
    SELECT id, "creatorId", "isPublic"
    FROM routines;
    `)
    return routines;
  } catch(error){
    console.error(error);
  }
}

async function getAllRoutines() {
  try{
    const {rows: routines} = await client.query(`
    SELECT routines.* ,users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id;
    `)
    const routineWithActivities = await attachActivitiesToRoutines(routines)

    return routineWithActivities;
  } catch(error){
    console.error(error);
  }
}


async function getAllPublicRoutines() {
  try{
    const {rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON "creatorId" = users.id
    WHERE "isPublic" = true;
    `)
    const routineWithActivities = await attachActivitiesToRoutines(routines)
    return routineWithActivities;
  } catch(error){
    console.error(error)
  }
}

async function getAllRoutinesByUser({ username }) {
  try{
  const {rows: routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users
  ON routines."creatorId" = users.id
  WHERE users.username = $1;
  `,[username])
  const routineWithActivities = await attachActivitiesToRoutines(routines)
  return routineWithActivities;
  } catch(error){
    console.error(error)
  }
}

async function getPublicRoutinesByUser({ username }) {
  try{
    const {rows:routines } = await client.query(`
      SELECT routines.*, users.username 
      AS "creatorName"
      FROM routines 
      INNER JOIN users 
      ON routines."creatorId" = users.id 
      WHERE users.username = $1;   
      `
    , [username]);
    const getAllRoutinesByUser = await attachActivitiesToRoutines(routines);
      return getAllRoutinesByUser;

  }
  catch(error){    
    console.log("Error while getting routines by user", error);
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines 
    INNER JOIN users 
    ON routines."creatorId" = users.id
    INNER JOIN routine_activities ON routines.id = routine_activities."routineId"
    WHERE routines."isPublic" = true AND routine_activities."activityId" = $1;
    `,
      [id]
    );

    const workoutStuff = await attachActivitiesToRoutines(routines);
    return workoutStuff;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
).join(', ')

try{ const{rows:[routine]} = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id = ${id}
    RETURNING *;
`,Object.values(fields)); 
return routine;
}catch(error){
  console.error(error)
}
}

async function destroyRoutine(id) {
  try{
    const {rows: [routineActivity]} = await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = ${id}
    RETURNING *;
    `)

  const {rows:[routine]} = await client.query(`
  DELETE FROM routines
  WHERE id = ${id}
  RETURNING *;
  `)
  return routineActivity, routine;
  } catch(error){
    console.error(error)
  }
}

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
