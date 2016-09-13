var passport  = require('passport')

exports.login = (req, res) => {
  res.view();
}

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

exports.authenticate = (req, res) => {
  passport.authenticate('local', function(err, user, info) {
    if ((err) || (!user)) {
      req.flash('message', 'Incorrect password or email')
      return res.redirect('/users/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        res.redirect('/users/login');
      } else {
        res.redirect('/');
      }
    })
  })(req, res)
}

exports.register = (req, res) => {
  User.findOne({ normalizedEmail: req.body.email.toLowerCase() }, (err, user) => {
    if (user) {
      req.flash('message', 'Email already used');
      res.redirect('/users/login');
    } else {
      User.create(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        },
        (err, user) => {
          req.logIn(user, (err) => {
            res.redirect('/');
          })
        }
      )
    }
  })
}