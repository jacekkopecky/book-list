// Auth0 settings

module.exports = Object.freeze({
  auth0: Object.freeze({
    clientId: 'N9qSgGHtOj1eLg5fDwiaeO9yu9NEJjQq',
    domain: 'dev-bl7cntsbvqqv2sju.uk.auth0.com',
    audience: 'https://books.jacek.cz/api-v2',
    tokenSigningAlg: 'RS256',
  }),
  serverURL: 'https://europe-west2-book-list-309615.cloudfunctions.net/bookListAPIv2/api/',
  serverURL2: 'http://localhost:8082/api/',
});
