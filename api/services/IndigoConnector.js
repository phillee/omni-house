var request = require('request'),
    url = require('url')

module.exports = (options) => {
  var auth = {
    user: options.auth.user,
    pass: options.auth.pass,
    sendImmediately: false
  }

  // the API is picky about characters in the appliance id
  this.encodeName = (v) => {
    return new Buffer(v).toString('base64')
  }

  this.decodeName = (v) => {
    return new Buffer(v, 'base64').toString('ascii')
  }

  this.getDevices = (success, error) => {
    makeRequest('/devices.json', {}, success, error)
  }

  this.getAppliances = (done) => {
    this.getDevices(parseDevices);

    function parseDevices(devices) {
      var appliances = devices.map((device) => {
        return {
          actions : [ 'turnOn', 'turnOff' ],
          additionalApplianceDetails : { nameURLEncoded : device.nameURLEncoded },
          // picky about characters in appliance id, "special characters: _ - = # ; : ? @ &"
          // encode it just to be safe
          applianceId : indigo.encodeName(device.nameURLEncoded),
          friendlyDescription : 'None',
          friendlyName : device.name,
          isReachable : true,
          // unclear if these fields must be present
          manufacturerName : 'Unknown',
          modelName : 'Unknown',
          version : 1
        }
      })
      done(null, appliances);
    }
  }

  this.setDevice = (id, params, success, error) => {
    makeRequest('/devices/' + id, _.extend(params, { _method : 'put' }), success, error)
  }

  function makeRequest(path, params, success, error) {
    request(
      {
        uri : url.resolve(options.host, path),
        qs : params,
        auth : auth
      }
    , (err, resp, body) => {
        if (err) {
          if (error) error(err)
          return
        }

        if (success) try {
          success(JSON.parse(body))
        } catch(err) {
          success()
        }
      }
    )
  }
  return this
}