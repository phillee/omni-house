var assert = require('chai').assert;

describe.only('Integration', () => {
  describe('#createWithData', () => {
    it('creates with encrypted data', (done) => {
      Integration.createWithData(
        { accountType: 'testIntegration' },
        { hello: 5, goodbye: 'abc' },
        (err, integration) => {
          assert.equal(integration.accountType, 'testIntegration');

          var decryptedData = integration.getDecryptedData();
          assert.equal(decryptedData.hello, 5);
          assert.equal(decryptedData.goodbye, 'abc');

          done();
        }
      )
    });
  });
});