/**
 * RefreshToken
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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
  values.token = UtilsService.uid(256)
  next()
}