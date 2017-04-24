exports.index = (req, res) => {
  res.view();
}

exports.learnMore = (req, res) => {
  res.view('home/learnMore');
}