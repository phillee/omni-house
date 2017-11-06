var cheerio = require('cheerio'),
    supertest = require('supertest'),
    agent

describe('Oauth', function() {
  var redirectUri = 'http://localhost:1337';

  before((done) => {
    agent = supertest.agent(sails.hooks.http.app);
    done();
  });

  describe('#login()', function() {
    it('creates user', (done) => {
      agent
        .post('/users/register')
        .send({ email: 'test@alexabridge.com', password: 'test' })
        .expect(302)
        .end(done);
    });

    var transactionId
    it('authorizes', (done) => {
      Client.create({
        name: 'Alexa',
        redirectURI: redirectUri
      }, (err, client) => {
        agent
          .post('/users/authenticate')
          .send({ email: 'test@alexabridge.com', password: 'test' })
          .end((err) => {
            agent
              .get('/auth/authorize?client_id=' + client.clientId + '&response_type=code&redirect_uri=' + client.redirectURI)
              .expect((res) => {
                var html = cheerio.load(res.text);
                transactionId = html('input[type="hidden"]').val();
                console.log('transaction', transactionId);
              })
              .expect(200)
              .end(done);
          })

      })
    })

    var accessCode
    it('redirects after a decision with a code', function (done) {
      agent
        .post('/auth/decision')
        .auth('test', 'test')
        .type('form')
        .send({ transaction_id: transactionId })
        .expect((res) => {
          accessCode = res.text.split('code=')[1];
          console.log('accessCode', accessCode)
        })
        .end(done);
    });

    var accessToken, refreshToken
    it('grants access and refresh tokens with an access code', function (done) {
      agent
        .post('/auth/token')
        .send({
          code: accessCode,
          grant_type  : 'authorization_code',
          redirect_uri: redirectUri
        })
        .type('urlencoded')
        .expect(200)
        .expect((res) => {
          accessToken = res.body.access_token;
          refreshToken = res.body.refresh_token;
          console.log('accessToken', accessToken);
          console.log('refreshToken', refreshToken);
        })
        .end(done);
    } );
  });

});