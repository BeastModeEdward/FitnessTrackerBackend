const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET="neverTell" } = process.env;
const { getUserById } = require("../db");

router.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");

    try {
        if (!auth) {
            next()
        } else if (auth.startsWith(prefix)) {
            const token = auth.slice(prefix.length);

            try {
                const { id } = jwt.verify(token, JWT_SECRET);

                if (id) {
                    req.user = await getUserById(id);
                    next();
                }
            }
            catch ({ name, message }) {
                next({
                    name: 'AuthorizationHeaderError',
                    message: `Authorization token must start with ${prefix}`
                });
            }
        }
    }
    catch ({ name, message }) {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        });
    }
})

// GET /api/health
router.get('/health', async (req, res, next) => {
    try {
        res.send({message: 'Healthy!!!'})
    }
     catch(error) {
        console.log(error)
        throw(error);
    }
    next()
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
