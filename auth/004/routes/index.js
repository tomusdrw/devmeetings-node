const Router = require('express').Router
const config = require('config')
const tokens = require('jsonwebtoken')

const activities = require('./activities')

const router = Router()
module.exports = router

router.use('/v1/api/activities/', activities)

router.post('/v1/api/tokens', (req, res) => {
  // 6/ Do obiektu usera dodajemy uprawnienia
  const user = {
    username: 'tomusdrw',
    permissions: [
      'create'
    ]
  }
  const secret = config.get('secret')
  const options = {
    expiresIn: '5m',
    issuer: 'my-app',
    audience: 'my-app'
  }

  const token = tokens.sign(user, secret, options)

  res
    .status(201)
    .json({ token })
})

router.get('/version', (req, res) => {
  res.json({
    version: require('../package.json').version,
    env: config.get('env')
  })
})

router.post('/crash', () => {
  throw new Error('Crashing!')
})
