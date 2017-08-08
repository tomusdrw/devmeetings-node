// 2/ Importujemy moduł cluster i liczbę procesorów (rdzeni)
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const http = require('http')
const config = require('config')

const app = require('./app')

// 10/ Pierwszy process będzie odpalał procesy potomne
if (cluster.isMaster) {
  console.log(`Starting master node. Spawning workers: ${numCPUs}`)

  for (let i=0; i < numCPUs; ++i) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  })
// 7/ Pozostałe processy odpalą serwer i będą współdzielić port.
} else {
  const port = process.env.PORT || config.get('port')

  http.createServer(app).listen(port, () => {
    console.log(`[${process.pid} Listening on :${port}`)
  })
}
