// Importujemy Router, który pozwoli nam stworzyć pod-aplikację.
const Router = require('express').Router
const config = require('config')

const activities = require('./activities')

// 2/ Tworzymy nowa instancję i eksportujemy na zewnątrz
const router = Router()
module.exports = router

// Komponujemy sub-router dla aktywności
router.use('/v1/api/activities/', activities)

// 10/ Definiujemy pozostałe route
router.get('/version', (req, res) => {
  res.json({
    version: require('../package.json').version,
    env: config.get('env')
  })
})

router.post('/crash', () => {
  throw new Error('Crashing!')
})
