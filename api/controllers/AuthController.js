var passport = require('passport')

exports.authenticate = (req, res) => {
  passport.authenticate('local', (err, user, exception) => {
    if ((err) || (!user)) return res.error(exception, '/login')

		req.logIn(
      user,
      (err) => {
        if (err) return res.redirect('/login')
	      res.redirect('/')
	  	}
    )
  })(req, res)
}

exports.authorize = (req, res, next) => {
	res.view('auth/authorize', { oauth2 : req.oauth2 })
}

exports.decision = (req, res, next) => {
}

exports.token = (req, res, next) => {
}

exports.test = (req, res) => {
  Client.findOne({ name: 'Alexa' }, (err, client) => {
    res.redirect('/auth/authorize?client_id=' + client.clientId + '&response_type=code&redirect_uri=' + client.redirectURI)
  })
}