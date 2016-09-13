exports.list = (req, res) => {
  AccessToken
  .find({ user: req.user.id })
  // .populate('client')
  .exec((err, accessTokens) => {
    res.locals.accessTokens = accessTokens;
    res.view();
  })
}