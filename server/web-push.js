const webPush = require('web-push');

const auth = require('./auth');
const config = require('./config');
const db = require('./db');

let useWebPush = false;

function init() {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webPush.setVapidDetails(
      config.website,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
    useWebPush = true;
    console.log('using webPush');
  } else {
    console.log('not using webPush');
  }
}

async function registerForPush(req, res) {
  if (!useWebPush) {
    res.sendStatus(202);
    return;
  }

  const user = auth.getUserEmail(req);
  const subscription = req.body;
  if (!subscription) {
    res.sendStatus(400);
    return;
  }

  await db.addSubscription(user, subscription);
  res.sendStatus(204);
}

function getVapidKey(req, res) {
  res.send(useWebPush ? process.env.VAPID_PUBLIC_KEY : 'none');
}

async function sendNotifications(req) {
  if (!useWebPush) {
    return;
  }

  const user = auth.getUserEmail(req);
  const subscriptions = await db.listSubscriptions(user);
  for (const sub of subscriptions) {
    webPush.sendNotification(sub, 'update').catch((e) => {
      console.log('could not notify', user, e);
    });
  }
}

module.exports = {
  init,
  registerForPush,
  getVapidKey,
  sendNotifications,
};
