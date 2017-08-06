const express = require('express')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const config = require('config')

const app = express()

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

app.use(morgan('dev'))
app.use(express.static('static'))

app.get('/version', (req, res) => {
  res.json({
    version: require('./package.json').version,
    env: config.get('env')
  })
})

app.post('/crash', () => {
  throw new Error('Crashing!')
})

const activities = [
  {
    id: 3,
    alt: 'Bicycle',
    name: 'Cycling',
    timeSpent: 120
  },
  {
    id: 7,
    alt: 'Swimmer',
    name: 'Swimming',
    timeSpent: 60
  },
  {
    id: 9,
    alt: 'Runners',
    name: 'Running',
    timeSpent: 30
  }
]

// 3/ Potrafimy już zareprezentować listę aktywności
app.get('/api/activities', (req, res) => {
  res.json(activities)
})

// 5/ W jaki sposób stworzyć API dla pozostałych operacji (dodaj, edytuj usuń)?
app.put('/api/activities/add', unimplemented)
app.get('/api/activities/:id', unimplemented)
app.post('/api/activities/:id/edit', unimplemented)
app.post('/api/activities/:id/delete', unimplemented)
app.get('/api/activities/page/:page', unimplemented)

function unimplemented () {
  throw new Error('Unimplemented!')
}

app.post(
  '/addActivity',
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    const { id, name } = req.body

    activities.push({
      id,
      name,
      alt: name,
      timeSpent: 0
    })

    res.redirect(303, '/')
  }
)

module.exports = app
