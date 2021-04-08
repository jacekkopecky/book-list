const express = require('express');

const db = require('./db');

const adminApi = express.Router();
module.exports = adminApi;

// wrap async function for express.js error handling
function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

adminApi.get('/users', asyncWrap(listUsers));

async function listUsers(req, res) {
  const user = req.user.emails[0].value;
  if (user !== 'jacek.kopecky@port.ac.uk') {
    res.sendStatus(403);
    return;
  }

  res.json(await db.listUsers());
}
