/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(done) {
  async.parallel([ makeUser, makeClient ], done)

  function makeUser(done) {
    User.findOne({email: 'me@example.com'}, (err, user) => {
      if (!user) {
        User.create(
          {
            email: 'me@example.com',
            password: 'password',
          }
        ).exec((err, user) => {
          console.log('default user', user)
          done()
        })
      } else {
        console.log('default user', user)
        done()
      }
    })
  }

  function makeClient(done) {
    Client.findOne({ name: 'Alexa' }, (err, client) => {
      if (!client) {
        Client.create(
          {
            name : 'Alexa',
            redirectURI : 'https://pitangui.amazon.com/api/skill/link/M17M7QIATENZRK',
            trusted : true
          }
        ).exec((err, client) => {
          console.log("client created");
          console.log(client)
          done()
        })
      } else {
        console.log('client exists')
        console.log(client)
        done()
      }
    })
  }
}
