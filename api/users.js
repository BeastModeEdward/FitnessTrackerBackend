/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { getUserByUsername, getPublicRoutinesByUser, createUser, getAllRoutinesByUser } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET = "notsosecret" } = process.env;

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
try{
    const _user = await getUserByUsername(username);

    if (_user){
        res.send({
            error: "UserExistError",
            message: `User ${username} is already taken.`,
            name: "This user already exists."
        });
    }

    if (password.length < 8) {
        res.send({
            error: "PasswordTooShort",
            message: "Password Too Short!",
            name: "Password does not meet length requirement"
        });
    }
    
    const user = await createUser({username, password})
    
    const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        JWT_SECRET,
        { expiresIn: "1w" }
      );
      res.send({
        message: "You Successfully Registered!",
        user,
        token,
      });
    } catch ({ name, message }) {
        next({ name, message });
      }
    });

// POST /api/users/login




router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    // request must have both
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserByUsername(username);

        
        if (user) {
            const token = await jwt.sign(user, JWT_SECRET);
            res.send({ message: "you're logged in!", token , user});
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
    } catch ({ name, message }) {
        ({ name, message });
    }
});

// GET /api/users/me

router.get('/me',  async (req, res, next) => {
    const header = req.headers.authorization

    try {
        if (!header) {
            res.status(401)
            res.send({
                error: 'Token is missing',
                message: 'You must be logged in to perform this action',
                name: 'NoTokenError'
            })

        } else {
                const token = header.split(' ')[1];
                const decodedUser = jwt.verify(token, JWT_SECRET);
                res.send(decodedUser);
            }

    } catch ({ name, message }) {
        next({ name, message })
    }
});

// GET /api/users/:username/routines

router.get('/:username/routines', async (req, res, next) => {
    try {
        const { username } = req.params;
    
        const [publicRoutines, allRoutines] = await Promise.all([
          getPublicRoutinesByUser({ username }),
          getAllRoutinesByUser({ username }),
        ]);
    
        if (req.user && req.user.username === username) {
          res.send(allRoutines);
        } else {
          res.send(publicRoutines);
        }
      } catch (error) {
        next(error);
      }
    });

module.exports = router;
