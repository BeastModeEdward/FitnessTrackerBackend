/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { getUserByUsername, getPublicRoutinesByUser } = require('../db');
const { requireLogin } = require('./util');

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);

    if (username == user.username){
        next({
            name: "SameUsername",
            message: "Please supply a different username"
        });
    }
    try {
        if (username && password) {
    
            res.send({ message: "you have created an account"});
        } else {
            next({
                name: 'MissingUsernamePassword',
                message: 'Username or password is missing'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }

});

// POST /api/users/login

const jwt = require('jsonwebtoken');

const { JWT_SECRET = "notsosecret" } = process.env;


router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    console.log("Username and password: ", username, password);

    // request must have both
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserByUsername(username);

        if (user && user.password == password) {
            const token = jwt.sign(user, JWT_SECRET);
            console.log("TOKEN: ", token);
            res.send({ message: "you're logged in!", token });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// GET /api/users/me

router.get('/me', requireLogin, async (req, res, next) => {
    const { username} = req.body;
    const user = await getUserByUsername(username);
    try {
        if (username == user.username ) {
            res.send({user});
        } else {
            next({
                name: "CanNotGetUser",
                message: 'can not get the User information '
            })
        }
    } catch (error) {
        next(error);
    }
})

// GET /api/users/:username/routines

router.get('/:username/routines', requireLogin, async (req, res, next) => {
    const { username } = req.body;
    const user = await getUserByUsername(username);
    const routine = await getPublicRoutinesByUser(username);
    try {
        if (user.username == routine.username) {
            res.send({ routine});
        } else {
            next({
                name: "CanNotGetRoutines",
                message: 'can not get the public routines information from this user '
            })
        }
    } catch (error) {
        next(error);
    }
})

module.exports = router;
