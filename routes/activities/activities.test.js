/* eslint-env mocha */

const express = require('express')
const request = require('supertest')
const expect = require('chai').expect

// 3/ Możemy przetestować pod-aplikację zupełnie niezależnie.
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
