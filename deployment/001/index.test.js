/* eslint-env mocha */

const request = require('supertest')
const expect = require('chai').expect

const app = require('./app')

describe('Server', () => {
  it('should respond to GET /version', () => {
    return request(app)
      .get('/version')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.version).to.equal('1.0.0')
      })
  })

  it('should serve HTML at /', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
  })
})
