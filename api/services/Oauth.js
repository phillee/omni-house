var oauth2orize = require('oauth2orize'),
    passport = require('passport'),
    login = require('connect-ensure-login'),
    bcrypt = require('bcrypt')

// Create OAuth 2.0 server
var server = oauth2orize.createServer()
module.exports = server

server.serializeClient((client, done) => {
  return done(null, client.clientId);
})

server.deserializeClient((id, done) => {
  console.log('deserializeClient', id);
  Client.findOne({ clientId: id }, (err, client) => {
    console.log('client is', client)
    if (err) return done(err)
    return done(null, client);
  })
})

// Generate authorization code
server.grant(oauth2orize.grant.code((client, redirectURI, user, ares, done) => {
  AuthCode.create({
    client: client,
    redirectURI: redirectURI,
    user: user,
    scope: ares.scope
  }).exec((err, code) => {
    if (err) return done(err,null)
    return done(null, code.code)
  })
}))

// Generate access token for Implicit flow
// Only access token is generated in this flow, no refresh token is issued
server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
  AccessToken.destroy({ user: user, client: client.client }, function (err) {
    if (err){
      return done(err);
    } else {
      AccessToken.create({ user: user, client: client.client }, function(err, accessToken){
        if(err) {
          return done(err);
        } else {
          return done(null, accessToken.token);
        }
      });
    }
  });
}));

// Exchange authorization code for access token
server.exchange(oauth2orize.exchange.code((client, code, redirectURI, done) => {
  console.log('exchanging token. client:', client, 'code', code);

  AuthCode
  .findOne({ code: code })
  .exec((err, code) => {
   if (err || !code) return done(err)
   // if (client.client !== code.client) return done(null, false)

   // Remove Refresh and Access tokens and create new ones
   RefreshToken.destroy({ user: code.user, client: code.client }, function (err) {
     if (err) return done(err);

     AccessToken.destroy({ user: code.user, client: code.client }, function (err) {
       if (err) return done(err);

       RefreshToken.create({ user: code.user, client: code.client }, function(err, refreshToken){
          if (err) return done(err);
          AccessToken.create({ user: code.user, client: code.client }, function(err, accessToken){
            if (err) return done(err);

            return done(null, accessToken.token, refreshToken.token, { 'expires_in': sails.config.oauth.tokenLife });
         });
       });
     });
   });
 });
}));


// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  console.log('exchanging, client is', client, 'refresh token', refreshToken, 'scope', scope);

  if (!client) return done(null);

  RefreshToken.findOne({ token: refreshToken }, (err, token) => {
    if (err) return done(err);
    if (!token) return done(null, false);

    User.findOne({id: token.user}, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);

      // Remove Refresh and Access tokens and create new ones
      RefreshToken.destroy({ user: user.id, client: client.client }, (err) => {
        if (err) return done(err);
        AccessToken.destroy({ user: user.id, client: client.client }, (err) => {
          if (err) return done(err);

          RefreshToken.create({ user: user.id, client: client.client }, (err, refreshToken) => {
            if (err) return done(err);
            AccessToken.create({ user: user.id, client: client.client }, (err, accessToken) => {
              if(err) {
                return done(err);
              } else {
                done(null, accessToken.token, refreshToken.token, { 'expires_in': sails.config.oauth.tokenLife });
              }
            });
          });
        });
      });
    });
  });
}));