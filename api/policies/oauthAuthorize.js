module.exports = (req, res, next) => {
  Oauth.authorize((clientId, redirectURI, done) => {
    Client.findOne({ clientId : clientId }, (err, client) => {
      if (err) { return done(err) }
      if (!client) { return done(null, false) }
      if (client.redirectURI != redirectURI) { return done(null, false) }
      return done(null, client, client.redirectURI)
    })
  })(req, res, next)
}