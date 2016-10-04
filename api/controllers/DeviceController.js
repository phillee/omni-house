exports.discover = (req, res) => {
  console.log(req.body);

  AccessToken
  .find({ user: req.user.id })
  // .populate('client')
  .exec((err, accessTokens) => {
    res.locals.accessTokens = accessTokens;
    res.view();
  })
}