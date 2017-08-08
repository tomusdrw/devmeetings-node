const blocked = require('blocked')
const fs = require('fs')
const http = require('http')

const port = process.env.PORT || 3000
const file = './file'

// 3/ Blocked poinformuje nas o tym, że event loop był zablokowany.
blocked((ms) => {
  console.log(`Event loop was blocked for ${ms}.`)
}, { threshold: 20 })

http.createServer((req, res) => {
  if (req.url === '/stream') {
    fs.createReadStream(file).pipe(res)
    return
  }

  // 3/ Możemy spróbować modyfikować bufory streama.
  if (req.url === '/stream2') {
    fs.createReadStream(file, { highWaterMark: 2**20 }).pipe(res)
    return
  }

  if (req.url === '/sync') {
    res.end(fs.readFileSync(file))
    return
  }

  if (req.url === '/async') {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end(err)
        return
      }

      res.end(data)
    })
    return
  }

  if (req.url === '/async2') {
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end(err)
        return
      }

      res.end(data)
    })
    return
  }

  res.writeHead(404, {
    'Content-Type': 'text/html'
  })
  res.end(`
    <h1>
      Wybierz request
    </h1>
    <p><a href="/stream">/stream</a></p>
    <p><a href="/sync">/sync</a></p>
    <p><a href="/async">/async</a></p>
  `)
}).listen(port, () => {
  console.log(`Listening on :${port}`)
})
