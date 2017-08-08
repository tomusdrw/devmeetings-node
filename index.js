const http = require('http')
const config = require('config')

const app = require('./app')

const port = process.env.PORT || config.get('port')

http.createServer(app).listen(port, () => {
  console.log(`Listening on :${port}`)
})
