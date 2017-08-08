const fs = require('fs')
const http = require('http')
const port = process.env.PORT || 3000

const file = './file'

http.createServer((req, res) => {
  // 4/ W przypadku requestów na /stream wysyłamy stream
  if (req.url === '/stream') {
    fs.createReadStream(file).pipe(res)
    return
  }

  // 4/ Czytam plik synchronicznie
  if (req.url === '/sync') {
    res.end(fs.readFileSync(file, 'utf8'))
    return
  }

  // 12/ Czytamy plik asynchronicznie
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
