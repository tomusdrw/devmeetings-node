const Router = require('express').Router
const config = require('config')

const activities = require('./activities')

const router = Router()
module.exports = router

router.use('/v1/api/activities/', activities)

router.get('/version', (req, res) => {
  res.json({
    version: require('../package.json').version,
    env: config.get('env')
  })
})

router.post('/crash', () => {
  throw new Error('Crashing!')
})
