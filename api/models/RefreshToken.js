exports.attributes = {
  user: {
    model: 'user'
  },
  client: {
    model: 'client'
  },
  token: {
    type: 'string'
  }
}

exports.beforeCreate = (values, next) => {
  values.token = UtilsService.uid(256);
  next();
}