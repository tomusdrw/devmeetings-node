//#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
// Importujemy connect
const connect = require('connect')

const port = process.env.PORT || 3000

// Tworzymy nową aplikację (serwer) z użyciem connect
const app = connect()

app.use((req, res) => {
  const { url } = req

  console.log(url)

  if (url === '/' || url === '/index.html') {
    serveFile('index.html', 'text/html', res)
  } else if (url === '/main.js') {
    serveFile('main.js', 'application/javascript', res)
  } else if (url === '/styles.css') {
    serveFile('styles.css', 'text/css', res)
  } else if (url === '/api/activities') {
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
  } else {
    res.writeHead(404)
    res.end('404: Not Found')
  }
})

// A następnie przekazujemy aplikację i startujemy serwer.
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
