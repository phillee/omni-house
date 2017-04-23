var CryptoJS = require("crypto-js");

module.exports = {
  attributes: {
    user: { model: 'user' },
    encryptedData: { type: 'string' },
    accountType: 'string',

    getDecryptedData: function() {
      var decryptedData = CryptoJS.AES.decrypt(this.encryptedData, sails.config.encryptionKey);

      return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
    }
  },
  createWithData: (params, data, done) => {
    var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), sails.config.encryptionKey),
        integrationData = _.extend({ encryptedData: encryptedData.toString() }, params)

    Integration.create(integrationData, done);
  }
}