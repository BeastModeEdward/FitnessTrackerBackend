const express = require('express');
const router = express.Router();
const { getAllRoutines, createRoutine } = require('../db');
const { requireUser } = require('./util');

// GET /api/routines

router.get('/', async (req, res, next) => {
    const routines = await getAllRoutines();

    try {
        if (routines) {

            res.send({routines});
        } else {
            next({
                name: 'NoRoutines',
                message: 'Could not return Routines'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }

});


// POST /api/routines

router.post('/', requireUser, async (req, res, next) => {
    const createRou = await createRoutine();
    
    try {
        if (createRou) {
            res.send({ });
        } else {
            next({
                name: "NoRoutines",
                message: 'could not Create a new routine'
            })
        }
    } catch (error) {
        next(error);
    }
})

// PATCH /api/routines/:routineId

/*
router.patch('/:routineId', requireLogin, async (req, res, next) => {

    try {
        if () {
            res.send({});
        } else {
            next({
                name: "NoRoutines",
                message: 'could not Update a routine, notably change public/private, the name, or the goal'
            })
        }
    } catch (error) {
        next(error);
    }
})
*/

// DELETE /api/routines/:routineId

/*
router.delete('/:routineId', requireLogin, async (req, res, next) => {
    const { } = req.body;

    try {
        if () {
            res.send({});
        } else {
            next({
                name: "NoRoutines",
                message: 'could not Hard delete a routine. Make sure to delete all the routineActivities whose routine is the one being deleted.'
            })
        }
    } catch (error) {
        next(error);
    }
})
*/

// POST /api/routines/:routineId/activities

/*
router.post('/:routineId/activities', async (req, res, next) => {
    const { } = req.body;

    try {
        if () {
            res.send({});
        } else {
            next({
                name: "NoRoutines",
                message: 'couldnt Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.'
            })
        }
    } catch (error) {
        next(error);
    }
})
*/

module.exports = router;
