exports.attributes = {
	name: {
    type: 'string',
    required: true
  },
  redirectURI: {
    type: 'string',
    required: true
  },
  clientId: 'string',
  clientSecret: 'string',
  trusted: {
    type: 'boolean',
    defaultsTo: false
  }
}

exports.beforeCreate = function(values, next) {
  values.clientId = UtilsService.uidLight(10);
  values.clientSecret = UtilsService.uid(30);
  next();
}