module.exports = (req, res, next) => {
  if (req.user) next();
  else {
    req.session.redirectUrl = req.originalUrl;
    res.redirect('/users/login');
  }
}