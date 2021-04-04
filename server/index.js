const express = require('express');
const cors = require('cors');
const GoogleAuth = require('simple-google-openid');

const config = require('./config');
const api = require('./api');

const app = express();

app.use(cors());
app.use(GoogleAuth(config.clientId));

app.get('/', (req, res) => { res.send('function running'); });

app.use('/api', GoogleAuth.guardMiddleware());

app.get('/api/ping', (req, res) => { res.send('authorized'); });

app.use('/api', api);

exports.bookListAPI = app;
