exports.authorize = (req, res, next) => {
	res.view('auth/authorize', { oauth2 : req.oauth2 })
}

// oauth2
exports.decision = Oauth.decision

exports.token = (req, res, next) => {
}

exports.test = (req, res) => {
  Client.findOne({ name: 'Alexa' }, (err, client) => {
    res.redirect('/auth/authorize?client_id=' + client.clientId + '&response_type=code&redirect_uri=' + client.redirectURI)
  })
}