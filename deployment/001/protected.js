const Router = require('express').Router
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')

const router = Router()
module.exports = router

router.use(bodyParser.urlencoded({ extended: false }))
router.use(cookieParser())

router.use(csurf({
  cookie: true
}))

router.get('/', (req, res) => {
  res.render('form', {
    csrfToken: req.csrfToken()
  })
})

router.post('/', (req, res) => {
    console.log('Modiying users permissions: ', req.body)
    res.send('Permissions modified.')
})


