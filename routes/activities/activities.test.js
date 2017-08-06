/* eslint-env mocha */

const express = require('express')
const request = require('supertest')
const expect = require('chai').expect

const activities = require('./activities')
const app = express()
app.use(activities)

describe('Activities', () => {
  it('should serve list of activities', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.length).to.equal(3)
      })
  })

  it('should add new activity', () => {
    return request(app)
      .post('/')
      // Przykład JWT wysyłanego w testach
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ')
      .send({
        name: 'Test',
        alt: 'test'
      })
      .expect(201)
      .then(res => {
        return request(app)
          .get('/')
          .then(res => {
            expect(res.body.length).to.equal(4)
          })
      })
  })
})
