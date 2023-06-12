const express = require('express');
const router = express.Router();
const { getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity, getActivityById, getActivityByName} = require('../db');

// GET /api/activities/:activityId/routines


router.get('/:activityId/routines', async (req, res, next) => {
    try {
        const { activityId } = req.params;
    
        const activity = await getActivityById(activityId);
        if (!activity) {
           return res.status(404).json({          
            error: "ActivityNotFoundError",  
            message: "Activity " + activityId + " not found",
            name: "ActivtyNotFoundError"
         });
        }
    
        // idk why but I couldn't get this working
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
                name: "cannotGetActivites",
                message: 'was not able to get all the activites'
            })
        }
    } catch (error) {
        next(error);
    }
})

// POST /api/activities

router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
    
        const existingActivity = await getActivityByName(name);
        if (existingActivity) {
          return res.send({
            error: "ActivityAlreadyExists",
            message: "An activity with name " + name + " already exists",
            name: "ActivityAlreadyExistsError",
          });
        }
    
        const activity = await createActivity({ name, description });
    
        res.send(activity);
      } catch (error) {
        next(error);
      }
    });
// PATCH /api/activities/:activityId

router.patch('/:activityId', async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const { name, description } = req.body;

        // Check if the activity exists
        const existingActivity = await getActivityById(activityId);
        if (!existingActivity) {
            return next({
                error: "ActivityNotFoundError",
                message: "Activity 10000 not found",
                name: "ActivityNotFoundError",
            });
        }

        // Check if the new name already exists for another activity
        const sameNameActivity = await getActivityByName(name);
        if (sameNameActivity && sameNameActivity.id !== activityId) {
        return next({
            error: "ActivityNameError",
            message: "An activity with name " + name + " already exists",
            name: "ActivityNameError",
        });
        }
        const updatedActivity = await updateActivity({id:activityId, name, description });

        res.send({ name: updatedActivity.name, id:parseInt(activityId), description: updatedActivity.description });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
