const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', function(done) {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏'
      }, done);
  });
});

describe('POST/api/v1/messages', () => {
  it('responds with inserted message', (done) => {
    const requestObj = {
      name: 'some name',
      message: 'some message',
      latitude: -90,
      longitude: 180
  };
  const responseObj = {
    ...requestObj,
    _id: '5b87c12e65c8105500fdeb93',
    date: '2018-08-30T10:04:30.982Z'
  };
    request(app)
      .post('/api/v1/messages')
      .send(requestObj)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        res.body._id = '5b87c12e65c8105500fdeb93';
        res.body.date = '2018-08-30T10:04:30.982Z';
      })
      .expect(200, responseObj, done);
  });


});

//
// res.body_id = '5b87c12e65c8105500fdeb93';
// res.body.date = '2018-08-30T10:04:39.982Z';
