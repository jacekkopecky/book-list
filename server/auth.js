// adapted from github.com/portsoc/sums2017

const OAuth2JWTBearer = require('express-oauth2-jwt-bearer');

const EMAIL_PROPERTY = 'https://jacek.cz/#auth0/email';

// the above relies on Auth0 giving us the user's email address in their access token
// use the following custom rule in Auth0 to ensure that:
/*
  function addEmailToAccessToken(user, context, callback) {
    // This rule adds the authenticated user's email address to the access token.
    const namespace = 'https://jacek.cz/#auth0/';
    if (user.email_verified) {
      context.accessToken[namespace + 'email'] = user.email;
    } else {
      context.accessToken[namespace + 'email'] = 'not verified';
    }
    return callback(null, user, context);
  }
*/

const config = require('./config');

const checker = OAuth2JWTBearer.auth({
  audience: config.auth0.audience,
  issuerBaseURL: `https://${config.auth0.domain}`,
  tokenSigningAlg: config.auth0.tokenSigningAlg,
});

// use OAuth2JWTBearer `checker` to check the actual token, but handle 401 errors
function authenticationMiddleware(req, res, next) {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    checker(req, res, (err) => {
      if (err) {
        // ignore the request, as if there was no Bearer token, but log it
        console.warn('bad bearer token', err);
        delete req.auth;
        next();
      } else {
        next(err);
      }
    });
  } else {
    next();
  }
}

function onlySignedInMiddleware(req, res, next) {
  const email = getUserEmail(req);
  if (!email) {
    res.set('WWW-Authenticate', `Bearer realm="${config.auth0.audience}"`);
    res.sendStatus(401);
  } else if (email === 'not verified') {
    res.status(403).send('email not verified');
  } else {
    next();
  }
}

function getUserEmail(req) {
  // this is where our Auth0 rules put the user's email verified address
  // put every email address into lowercase
  return req?.auth?.payload?.[EMAIL_PROPERTY]?.toLowerCase?.();
}

module.exports = {
  authenticationMiddleware,
  onlySignedInMiddleware,
  config,
  getUserEmail,
};
