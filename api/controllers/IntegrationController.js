exports.create = (req, res) => {
  Integration
  .findOne({ user: req.user.id, accountType: req.body.accountType })
  .exec((err, integration) => {
    if (integration) {
      req.flash('message', 'Account type already exists');
      res.redirect('/integrations/new');
    } else {
      Integration.create(
        {
          accountType: req.body.accountType,
          url: req.body.url,
          username: req.body.username,
          password: req.body.password,
          user: req.user
        },
        (err, user) => {
          res.redirect('/integrations');
        }
      )
    }
  })
}

exports.new = (req, res) => {
  res.view();
}

exports.list = (req, res) => {
  Integration
  .find({ user: req.user.id })
  // .populate('client')
  .exec((err, accessTokens) => {
    res.locals.accessTokens = accessTokens;
    res.view();
  })
}