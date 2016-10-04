var bcrypt = require('bcrypt');

exports.attributes = {
  email: {
    type: 'string',
    required: true
  },
  hashedPassword: {
    type: 'string',
  },
  // Override toJSON method to remove password from API
  toJSON: () => {
    var obj = this.toObject();
    delete obj.password;
    return obj;
  }
}

exports.beforeCreate = (values, next) => {
  bcrypt.hash(values.password, 10, function(err, hash) {
    if (err) return next(err);
    values.hashedPassword = hash;
    delete values.password;
    next();
  });
}

exports.beforeValidate = (values, next) => {
  if (values.email) {
    values.normalizedEmail = values.email.toLowerCase();
  }
  next();
}