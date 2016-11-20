var passport  = require('passport')

module.exports = (req, res, next) => {
  if (req.body && req.body.event) {
    var event = req.body.event;
    if (event.payload && event.payload.accessToken) {
      req.body.access_token = event.payload.accessToken;
      return passport.authenticate('bearer')(req, res, next);
    } else next();
  } else next();
}