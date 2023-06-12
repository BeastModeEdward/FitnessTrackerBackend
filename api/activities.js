const express = require('express');
const router = express.Router();
const { requireLogin } = require('./util');
const { getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity } = require('../db');

// GET /api/activities/:activityId/routines


router.get('/:activityId/routines', async (req, res, next) => {
    const activites = await getPublicRoutinesByActivity();
    
    try {
        if (activites) {
            res.send({activites});
        } else {
            next({
                name: "CantGetActivites",
                message: 'was not able to get all public routines which feature that activity'
            })
        }
    } catch (error) {
        next(error);
    }
})

// GET /api/activities

router.get('/', async (req, res, next) => {
    const activities = await getAllActivities();
    
    try {
        if (activities) {
            res.send({ activities });
        } else {
            next({
                name: "CANTgetActivites",
                message: 'was not able to get all the activites'
            })
        }
    } catch (error) {
        next(error);
    }
})

// POST /api/activities

router.post('/', requireLogin, async (req, res, next) => {
    const createAct = await createActivity();
    try {
        if (createAct) {
            res.send({message: "the activity was created"});
        } else {
            next({
                name: "CANTCreateActivity",
                message: 'was not able to create the activity'
            })
        }
    } catch (error) {
        next(error);
    }
})

// PATCH /api/activities/:activityId

router.patch('/:activityId', requireLogin, async (req, res, next) => {
    const updateAct = await updateActivity();
    try {
        if (updateAct) {
            res.send({ message: "the activity was updated" });
        } else {
            next({
                name: "CANTCreateActivity",
                message: 'was not able to update the activity'
            })
        }
    } catch (error) {
        next(error);
    }
})

module.exports = router;
