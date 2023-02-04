const express = require('express');
const cors = require('cors');

const auth = require('./auth');
const api = require('./api');
const admin = require('./api-admin');

const app = express();

app.use(cors());
app.use(auth.authenticationMiddleware);

app.get('/', (req, res) => { res.send('function running'); });

app.use('/api', auth.onlySignedInMiddleware);

app.get('/api/ping', (req, res) => { res.send(`authorized as ${auth.getUserEmail(req)}`); });

app.use('/api/admin', admin);
app.use('/api', api);

exports.bookListAPIv2 = app;

if (process.env.TESTING && require.main === module) {
  const port = Number(process.env.PORT) || 8082;
  app.listen(port, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`started on port ${port}`);
    }
  });
}
