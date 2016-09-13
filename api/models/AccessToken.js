exports.attributes = {
  user: {
    model: 'user'
  },
  client: {
    model: 'client'
  },
  token: 'string',
  scope: 'string'
}

exports.beforeCreate = (values, next) => {
  values.token = UtilsService.uid(255)
  next()
}