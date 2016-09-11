exports.attributes = {
  code: {
    type: 'string'
  },
  user: {
    model: 'user'
  },
  client: {
    model: 'client'
  },
  redirectURI: {
    type: 'string',
    required: true
  }
}

exports.beforeCreate = (values, next) => {
  values.code = UtilsService.uid(16)
  next()
}