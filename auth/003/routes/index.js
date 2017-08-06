const Router = require('express').Router
const config = require('config')
const tokens = require('jsonwebtoken')

const activities = require('./activities')

const router = Router()
module.exports = router

router.use('/v1/api/activities/', activities)

// Tworzymy nowy endpoint na którym będzie można uzyskać token
router.post('/v1/api/tokens', (req, res) => {
  // 3/ Będziemy podpisywać obiekt usera
  const user = {
    username: 'tomusdrw'
  }
  // Secret wyciągamy z configa
  const secret = config.get('secret')
  // 8/ Dodajemy opcje, takie jak:
  const options = {
    // Datę wygaśnięcia tokenu,
    expiresIn: '30s',
    // Wystawca tokenu
    issuer: 'my-app',
    // i odbiorca tokenu
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
