const express = require('express');
const router = express.Router();
const { requireUser } = require('./util');
const { getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity, getActivityById, getActivityByName} = require('../db');

// GET /api/activities/:activityId/routines


router.get('/:activityId/routines', async (req, res, next) => {
    
    try {
        const {activityId} = req.params 
        const activity = await getActivityById(activityId);
        if (!activity) {
            return res.status(404).json({          
                error: "ActivityNotFoundError",  
                message: "Activity " +activityId + " not found",
                name: "ActivtyNotFound"
             });
            }
        
            // Retrieve the public routines featuring the activity
            const routines = await getPublicRoutinesByActivity({id:activityId});
        
            res.send(routines);
          } catch (error) {
            next(error);
          }
})

// GET /api/activities

router.get('/', async (req, res, next) => {
    
    try {
        const activities = await getAllActivities();
        if (activities) {
            res.send(activities );
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

router.post('/', requireUser, async (req, res, next) => {
    const { name, description } = req.body
    try {
  
      // Check if an activity with the same name already exists
      const existingActivity = await getActivityByName(name);
      if (existingActivity) {
        return res.send({
          error: "ActivityAlreadyExist",
          message: "An activity with name " + name + " already exists",
          name: "ActivityAlreadyExist",
        });
      }

        const createAct = await createActivity({name, description});
        res.send(createAct)
    } catch ({ name, message }) {
        next({ name, message });
      }
})

// PATCH /api/activities/:activityId

router.patch('/:activityId', requireUser, async (req, res, next) => {
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
