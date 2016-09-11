exports.list = (req, res) => {
  Client
  .find()
  .exec((err, clients) => {
    res.locals.clients = clients;
    res.view();
  })
}