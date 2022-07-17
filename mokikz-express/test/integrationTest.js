'use strict';
const assert = require('assertthat');

const supertest = require('supertest');
const app = require('../app');

test('Integration test', async function () {
  this.timeout = 10 * 60 * 1000;
  console.log(`Hallo`);
  await new Promise((resolve) => {
    supertest(app)
      .get('/data.js')
      .send()
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        assert.that(err).is.null();
      });
  });
});
