const Router = require('express').Router
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')

const router = Router()
module.exports = router

// Dodajemy body parser, bo będziemy czytać wartości z formularza.
router.use(bodyParser.urlencoded({ extended: false }))
// Dodajemy cookie parser bo tam będziemy trzymać tokeny.
router.use(cookieParser())

// Dodajemy csrf protection. Musi być dodany po cookieParser i bodyParser
router.use(csurf({
  cookie: true
}))

// 5/ Renderujemy formularz w przypadku requestu GET
router.get('/', (req, res) => {
  res.render('form', {
    csrfToken: req.csrfToken()
  })
})

// 4/ W przypadku POSTa modyfikujemy uprawnienia.
router.post('/', (req, res) => {
    console.log('Modiying users permissions: ', req.body)
    res.send('Permissions modified.')
})


