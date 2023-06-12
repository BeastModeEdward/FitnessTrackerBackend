const express = require("express");
const router = express.Router();
const {
  createRoutine,
  getAllPublicRoutines,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/routines
router.use((req, res, next) => {
    console.log("Your request has been made");

    next();
});


router.get("/", async (req, res, next) => {
  try {
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines

router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const creatorId = req.user.id;

  try {
    const newRoutine = await createRoutine({
      creatorId,
      isPublic,
      name,
      goal,
    });
    console.log(newRoutine);
    res.send(newRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId
/*
router.patch("/:routineId", requireUser, async (req, res, next) => {
    
});

// DELETE /api/routines/:routineId

router.delete("/:routineId", requireUser, async (req, res, next) => {
});

// POST /api/routines/:routineId/activities

router.post("/:routineId/activities", async (req, res, next) => {

})
*/
module.exports = router;
