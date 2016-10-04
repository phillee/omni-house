exports.attributes = {
  user: {
    model: 'user'
  },
  username: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  },
  accountType: 'string',
  url: 'string'
}