//#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
const connect = require('connect')

const port = process.env.PORT || 3000

const app = connect()

// Każdy plik rejestrujemy osobno, connect zajmie się za nas routingiem*.
app.use('/index.html', (req, res) => serveFile('index.html', 'text/html', res))
app.use('/main.js', (req, res) => serveFile('main.js', 'application/javascript', res))
app.use('/styles.css', (req, res) => serveFile('styles.css', 'text/css', res))
app.use('/api/activities', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify([
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
  ]))
})

// 11/ Fallback do index.html musimy dać na samym końcu,
// -- Routy muszą się tylko zaczynać od podanej ścieżki.
app.use('/', (req, res, next) => {
  // 3/ W Przypadku kiedy faktycznie obsługujem główny URL zwróć index.
  if (req.url === '/') {
    serveFile('index.html', 'text/html', res)
    return
  }

  // W przeciwnym przypadku wywołamy po prostu `next()` aby pozwolić na domyślne zachowanie.
  next()
})

http.createServer(app).listen(port, () => {
  console.log(`Listening on :${port}`)
})

function readFile (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`./static/${file}`, 'utf8', (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

async function serveFile (file, mime, res) {
  try {
    const content = await readFile(file)
    res.writeHead(200, {
      'Content-Type': mime
    })
    res.end(content)
  } catch (err) {
    console.error(err)
    res.writeHead(500)
    res.end(`Internal Error`)
  }
}
