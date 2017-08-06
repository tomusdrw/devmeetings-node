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

  it('should serve list of activities at /api/activities', () => {
    return request(app)
      .get('/api/activities')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.length).to.equal(3)
      })
  })

  it('should add new activity via POST /addActivity', () => {
    return request(app)
      .post('/addActivity')
      .send('name=Test')
      .send('id=6')
      .expect(303)
      .then(res => {
        return request(app)
          .get('/api/activities')
          .then(res => {
            expect(res.body.length).to.equal(4)
          })
      })
  })
})
