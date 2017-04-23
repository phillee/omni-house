var CryptoJS = require("crypto-js");

exports.create = (req, res) => {
  Integration.createWithData(
    {
      accountType: req.body.accountType,
      user: req.user
    },
    req.body.data,
    (err, user) => {
      res.redirect('/integrations');
    }
  )
}

exports.new = (req, res) => {
  res.view();
}

exports.devices = (req, res) => {

}

exports.delete = (req, res) => {
  Integration
  .destroy({ id: req.params.id, user: req.user.id })
  .exec((err) => {
    req.flash('message', 'Integration deleted');
    return res.redirect('/integrations');
  })
}

exports.list = (req, res) => {
  Integration
  .find({ user: req.user.id })
  // .populate('client')
  .exec((err, integrations) => {
    res.locals.integrations = integrations;
    res.view();
  })
}