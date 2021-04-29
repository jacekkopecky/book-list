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

adminApi.use(authorizeAdmin);

adminApi.get('/users', asyncWrap(listUsers));
adminApi.get('/users/:email/bookStats', asyncWrap(loadUserBookStats));

function authorizeAdmin(req, res, next) {
  const user = req.user.emails[0].value;
  if (user !== 'jacek.kopecky@port.ac.uk') {
    res.sendStatus(403);
  } else {
    next();
  }
}

async function listUsers(req, res) {
  res.json(await db.listUsers());
}

async function loadUserBookStats(req, res) {
  const user = req.params.email;
  res.json({
    ...await db.getBookStats(user),
    user,
  });
}
