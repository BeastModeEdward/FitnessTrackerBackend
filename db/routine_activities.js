const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
    const {rows: [routineActivity]} = await client.query(`
    INSERT INTO routineActivities("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,[routineId, activityId, count, duration])
    return routineActivity;
  } catch(error){
    console.error(error)
  }
}

async function getRoutineActivityById(id) {
  try{
  const {rows: routineActivity}= await client.query(`
  SELECT * 
  FROM routineActivities
  WHERE id=${id};
  `)
  return routineActivity;
} catch(error){
  console.error(error)
}
}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
