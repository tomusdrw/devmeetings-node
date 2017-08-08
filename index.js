const Good = require('good')
const Hapi = require('hapi')
const Inert = require('inert')
const Lout = require('lout')
const Vision = require('vision')

const Routes = require('./routes');

const server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 3000
});

server.register([
  Inert,
  Vision,
  {
    register: Lout,
    options: {
      endpoint: '/docs'
    }
  },
  {
    register: Good,
    options: {
      reporters: {
        console: [{
          module: 'good-console',
          args: [{
            response: '*',
            log: '*'
          }]
        }, 'stdout']
      }
    }
  }
], (err) => {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.route(Routes);

  server.start((err) => {
    if (err) {
      console.log(err)
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
