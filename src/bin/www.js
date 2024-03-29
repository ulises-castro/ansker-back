#!/usr/bin/env node

// bin/www.js
/**
 * Module dependencies.
 */


import app from '../server'
import debugLib from 'debug'
import http from 'http'
import https from 'https'

import fs from 'fs'
const debug = debugLib('ansker-back:server')
// ..generated code b

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

console.log(port, "Puerto aqui")

/**
 * Create HTTP server.
 */

// var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
let server = http.createServer(app)

if (process.env.NODE_ENV === 'development') {
  const ssl = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT)
  }

  server = https.createServer(ssl, app)
}

server.listen(port, process.env.HOST)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port
  debug('Listening on ' + bind)

  console.log('Listen on ' + bind)
}
