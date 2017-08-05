//#!/usr/bin/env node

const http = require('http')
const fs = require('fs')

const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
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

server.listen(port, () => {
  console.log(`Listening on :${port}`)
})

// Tworzymy pomocniczą funkcję, ktora zwróci Promise na zawartość pliku
function readFile (file) {
  // Tworzymy nowy Promise (Revealing Constructor Pattern)
  return new Promise((resolve, reject) => {
    // 3/ W Przypadku błędu odrzucamy Promise
    fs.readFile(`./static/${file}`, 'utf8', (err, content) => {
      if (err) {
        reject(err)
      } else {
        // ...a jak wszystko jest ok to zwracamy wartość
        resolve(content)
      }
    })
  })
}

function serveFile (file, mime, res) {
  // 12/ Funkcja serwująca plik też nam się upraszcza.
  readFile(file)
    .then(content => {
      res.writeHead(200, {
        'Content-Type': mime
      })
      res.end(content)
    })
    .catch(err => {
      console.error(err)
      res.writeHead(500)
      res.end(`Internal Error`)
    })
}
