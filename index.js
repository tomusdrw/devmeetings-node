//#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
const connect = require('connect')

const port = process.env.PORT || 3000

const app = connect()

// 14/ Middleware wygląda następująco:
app.use((req, res, next) => {
  // Zapisujemy czas podczas wejścia (jest pierwszy w kolejności)
  const start = process.hrtime()

  // Wołamy pozostałe middlewary
  next()

  // 5/ Kiedy wszystko zostanie przetworzone wypisujemy czas.
  // -- res.on('finish', () =>{
  const time = process.hrtime(start)
  const ms = time[0] * 1e3 + time[1] * 1e-6
  console.log(`${ms} ms`)
  // -- })
})

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

app.use('/', (req, res, next) => {
  if (req.url === '/') {
    serveFile('index.html', 'text/html', res)
    return
  }

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
