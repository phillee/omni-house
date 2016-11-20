exports.discover = (req, res) => {
  Integration
  .find({ user: req.user.id })
  .exec((err, integrations) => {
    async.map(integrations, handleIntegration, done)

    function handleIntegration(integration, done) {
      if (integration.accountType == 'Indigo') {
        var indigo = indigoFromIntegration(integration);
        indigo.getAppliances(done);
      } else {
        console.log('Unknown integration', integration.accountType);
        done(null, []);
      }
    }

    function done(err, results) {
      res.json({
        discoveredAppliances: _.flatten(results)
      });
    }
  })
}

function indigoFromIntegration(integration) {
  var indigoConfig = {
    auth: {
      user: integration.username,
      pass: integration.password
    },
    host: integration.url
  };

  return IndigoConnector(indigoConfig);
}

exports.control = (req, res) => {
  console.log('control', req.body)
  var event = req.body.event,
      params = {},
      nameURLEncoded = event.payload.appliance.additionalApplianceDetails.nameURLEncoded

  if (event.header.name === 'TurnOnRequest') params.isOn = 1
  else if (event.header.name === 'TurnOffRequest') params.isOn = 0

  Integration
  .findOne({
    user: req.user.id,
    accountType: 'Indigo'
  })
  .exec((err, integration) => {
    if (err || !integration) return res.json({});

    var indigo = indigoFromIntegration(integration);
    indigo.setDevice(nameURLEncoded, params, handleResult, handleResult);

    function handleResult(err) {
      res.json({});
    }
  })
}