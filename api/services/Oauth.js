var oauth2orize         = require('oauth2orize'),
    passport            = require('passport'),
    login               = require('connect-ensure-login'),
    bcrypt              = require('bcrypt')

// Create OAuth 2.0 server
var server = oauth2orize.createServer()

server.serializeClient((client, done) => {
  return done(null, client.id)
})

server.deserializeClient((id, done) => {
  Client.findOne(id, (err, client) => {
    if (err) return done(err)
      return done(null, client)
    })
  }
)

// Generate authorization code
server.grant(oauth2orize.grant.code((client, redirectURI, user, ares, done) => {
  AuthCode.create({
    clientId: client.clientId,
    redirectURI: redirectURI,
    userId: '1',
    scope: ares.scope
  }).exec((err, code) => {
    if (err) return done(err,null)
    return done(null,code.code)
  })
}))

// Generate access token for Implicit flow
// Only access token is generated in this flow, no refresh token is issued
server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
  AccessToken.destroy({ userId: user.id, clientId: client.clientId }, function (err) {
    if (err){
      return done(err);
    } else {
      AccessToken.create({ userId: user.id, clientId: client.clientId }, function(err, accessToken){
        if(err) {
          return done(err);
        } else {
          return done(null, accessToken.token);
        }
      });
    }
  });
}));


module.exports = server

// Exchange authorization code for access token
server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
  AuthCode.findOne(
    { code: code }
  ).exec((err, code) => {
   if (err || !code) return done(err)

   // if (client.clientId !== code.clientId) return done(null, false)

   // Remove Refresh and Access tokens and create new ones
   RefreshToken.destroy({ userId: code.userId, clientId: code.clientId }, function (err) {
     if (err) {
       return done(err);
     } else {
       AccessToken.destroy({ userId: code.userId, clientId: code.clientId }, function (err) {
         if (err){
           return done(err);
         } else {
           RefreshToken.create({ userId: code.userId, clientId: code.clientId }, function(err, refreshToken){
             if(err){
               return done(err);
             } else {
               AccessToken.create({ userId: code.userId, clientId: code.clientId }, function(err, accessToken){
                 if(err) {
                   return done(err);
                 } else {
                   return done(null, accessToken.token, refreshToken.token, { 'expires_in': sails.config.oauth.tokenLife });
                 }
               });
             }
           });
         }
       });
     }
   });

 });
}));


// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {

    RefreshToken.findOne({ token: refreshToken }, function(err, token) {

        if (err) { return done(err); }
        if (!token) { return done(null, false); }
        if (!token) { return done(null, false); }

        User.findOne({id: token.userId}, function(err, user) {

            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            // Remove Refresh and Access tokens and create new ones
            RefreshToken.destroy({ userId: user.id, clientId: client.clientId }, function (err) {
              if (err) {
                return done(err);
              } else {
                AccessToken.destroy({ userId: user.id, clientId: client.clientId }, function (err) {
                  if (err){
                    return done(err);
                  } else {
                    RefreshToken.create({ userId: user.id, clientId: client.clientId }, function(err, refreshToken){
                      if(err){
                        return done(err);
                      } else {
                        AccessToken.create({ userId: user.id, clientId: client.clientId }, function(err, accessToken){
                          if(err) {
                            return done(err);
                          } else {
                            done(null, accessToken.token, refreshToken.token, { 'expires_in': sails.config.oauth.tokenLife });
                          }
                        });
                      }
                    });
                  }
                });
              }
           });
        });
    });
}));

module.exports = server