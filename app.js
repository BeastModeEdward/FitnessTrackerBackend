require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const apiRouter = require('./api');
app.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

module.exports = app;
