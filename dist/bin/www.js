#!/usr/bin/env node
// bin/www.js

/**
 * Module dependencies.
 */
"use strict";

var _server = _interopRequireDefault(require("../server"));

var _debug = _interopRequireDefault(require("debug"));

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug.default)('ansker-back:server'); // ..generated code b

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');

_server.default.set('port', port);
/**
 * Create HTTP server.
 */
// var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */


const ssl = {
  key: _fs.default.readFileSync(process.env.SSL_KEY),
  cert: _fs.default.readFileSync(process.env.SSL_CERT)
};
const choiceProtocol = process.env.NODE_ENV === 'development' ? [_https.default, ssl] : [_http.default, {}];

const server = _https.default.createServer(choiceProtocol[1], _server.default);

server.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vd3d3LmpzIl0sIm5hbWVzIjpbImRlYnVnIiwicG9ydCIsIm5vcm1hbGl6ZVBvcnQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsImFwcCIsInNldCIsInNzbCIsImtleSIsImZzIiwicmVhZEZpbGVTeW5jIiwiU1NMX0tFWSIsImNlcnQiLCJTU0xfQ0VSVCIsImNob2ljZVByb3RvY29sIiwiTk9ERV9FTlYiLCJodHRwcyIsImh0dHAiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJsaXN0ZW4iLCJvbiIsIm9uRXJyb3IiLCJvbkxpc3RlbmluZyIsInZhbCIsInBhcnNlSW50IiwiaXNOYU4iLCJlcnJvciIsInN5c2NhbGwiLCJiaW5kIiwiY29kZSIsImNvbnNvbGUiLCJleGl0IiwiYWRkciIsImFkZHJlc3MiXSwibWFwcGluZ3MiOiJBQUFBO0FBRUE7O0FBQ0E7Ozs7O0FBS0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQSxNQUFNQSxLQUFLLEdBQUcsb0JBQVMsb0JBQVQsQ0FBZCxDLENBQ0E7O0FBRUE7Ozs7QUFJQSxJQUFJQyxJQUFJLEdBQUdDLGFBQWEsQ0FBQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLElBQVosSUFBb0IsTUFBckIsQ0FBeEI7O0FBQ0FDLGdCQUFJQyxHQUFKLENBQVEsTUFBUixFQUFnQk4sSUFBaEI7QUFFQTs7O0FBSUE7O0FBRUE7Ozs7O0FBSUEsTUFBTU8sR0FBRyxHQUFHO0FBQ1ZDLEVBQUFBLEdBQUcsRUFBRUMsWUFBR0MsWUFBSCxDQUFnQlIsT0FBTyxDQUFDQyxHQUFSLENBQVlRLE9BQTVCLENBREs7QUFFVkMsRUFBQUEsSUFBSSxFQUFFSCxZQUFHQyxZQUFILENBQWdCUixPQUFPLENBQUNDLEdBQVIsQ0FBWVUsUUFBNUI7QUFGSSxDQUFaO0FBS0EsTUFBTUMsY0FBYyxHQUFJWixPQUFPLENBQUNDLEdBQVIsQ0FBWVksUUFBWixLQUF5QixhQUExQixHQUEyQyxDQUFDQyxjQUFELEVBQVFULEdBQVIsQ0FBM0MsR0FBMEQsQ0FBQ1UsYUFBRCxFQUFPLEVBQVAsQ0FBakY7O0FBRUEsTUFBTUMsTUFBTSxHQUFHRixlQUFNRyxZQUFOLENBQW1CTCxjQUFjLENBQUMsQ0FBRCxDQUFqQyxFQUFzQ1QsZUFBdEMsQ0FBZjs7QUFFQWEsTUFBTSxDQUFDRSxNQUFQLENBQWNwQixJQUFkLEVBQW9CLFNBQXBCO0FBQ0FrQixNQUFNLENBQUNHLEVBQVAsQ0FBVSxPQUFWLEVBQW1CQyxPQUFuQjtBQUNBSixNQUFNLENBQUNHLEVBQVAsQ0FBVSxXQUFWLEVBQXVCRSxXQUF2QjtBQUVBOzs7O0FBSUEsU0FBU3RCLGFBQVQsQ0FBdUJ1QixHQUF2QixFQUE0QjtBQUMxQixNQUFJeEIsSUFBSSxHQUFHeUIsUUFBUSxDQUFDRCxHQUFELEVBQU0sRUFBTixDQUFuQjs7QUFFQSxNQUFJRSxLQUFLLENBQUMxQixJQUFELENBQVQsRUFBaUI7QUFDZjtBQUNBLFdBQU93QixHQUFQO0FBQ0Q7O0FBRUQsTUFBSXhCLElBQUksSUFBSSxDQUFaLEVBQWU7QUFDYjtBQUNBLFdBQU9BLElBQVA7QUFDRDs7QUFFRCxTQUFPLEtBQVA7QUFDRDtBQUVEOzs7OztBQUlBLFNBQVNzQixPQUFULENBQWlCSyxLQUFqQixFQUF3QjtBQUN0QixNQUFJQSxLQUFLLENBQUNDLE9BQU4sS0FBa0IsUUFBdEIsRUFBZ0M7QUFDOUIsVUFBTUQsS0FBTjtBQUNEOztBQUVELE1BQUlFLElBQUksR0FBRyxPQUFPN0IsSUFBUCxLQUFnQixRQUFoQixHQUNULFVBQVVBLElBREQsR0FFVCxVQUFVQSxJQUZaLENBTHNCLENBU3RCOztBQUNBLFVBQVEyQixLQUFLLENBQUNHLElBQWQ7QUFDRSxTQUFLLFFBQUw7QUFDRUMsTUFBQUEsT0FBTyxDQUFDSixLQUFSLENBQWNFLElBQUksR0FBRywrQkFBckI7QUFDQTNCLE1BQUFBLE9BQU8sQ0FBQzhCLElBQVIsQ0FBYSxDQUFiO0FBQ0E7O0FBQ0YsU0FBSyxZQUFMO0FBQ0VELE1BQUFBLE9BQU8sQ0FBQ0osS0FBUixDQUFjRSxJQUFJLEdBQUcsb0JBQXJCO0FBQ0EzQixNQUFBQSxPQUFPLENBQUM4QixJQUFSLENBQWEsQ0FBYjtBQUNBOztBQUNGO0FBQ0UsWUFBTUwsS0FBTjtBQVZKO0FBWUQ7QUFFRDs7Ozs7QUFJQSxTQUFTSixXQUFULEdBQXVCO0FBQ3JCLE1BQUlVLElBQUksR0FBR2YsTUFBTSxDQUFDZ0IsT0FBUCxFQUFYO0FBQ0EsTUFBSUwsSUFBSSxHQUFHLE9BQU9JLElBQVAsS0FBZ0IsUUFBaEIsR0FDVCxVQUFVQSxJQURELEdBRVQsVUFBVUEsSUFBSSxDQUFDakMsSUFGakI7QUFHQUQsRUFBQUEsS0FBSyxDQUFDLGtCQUFrQjhCLElBQW5CLENBQUw7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuLy8gYmluL3d3dy5qc1xuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cblxuaW1wb3J0IGFwcCBmcm9tICcuLi9zZXJ2ZXInXG5pbXBvcnQgZGVidWdMaWIgZnJvbSAnZGVidWcnXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJ1xuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJ1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5jb25zdCBkZWJ1ZyA9IGRlYnVnTGliKCdhbnNrZXItYmFjazpzZXJ2ZXInKVxuLy8gLi5nZW5lcmF0ZWQgY29kZSBiXG5cbi8qKlxuICogR2V0IHBvcnQgZnJvbSBlbnZpcm9ubWVudCBhbmQgc3RvcmUgaW4gRXhwcmVzcy5cbiAqL1xuXG52YXIgcG9ydCA9IG5vcm1hbGl6ZVBvcnQocHJvY2Vzcy5lbnYuUE9SVCB8fCAnMzAwMCcpXG5hcHAuc2V0KCdwb3J0JywgcG9ydClcblxuLyoqXG4gKiBDcmVhdGUgSFRUUCBzZXJ2ZXIuXG4gKi9cblxuLy8gdmFyIHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcClcblxuLyoqXG4gKiBMaXN0ZW4gb24gcHJvdmlkZWQgcG9ydCwgb24gYWxsIG5ldHdvcmsgaW50ZXJmYWNlcy5cbiAqL1xuXG5jb25zdCBzc2wgPSB7XG4gIGtleTogZnMucmVhZEZpbGVTeW5jKHByb2Nlc3MuZW52LlNTTF9LRVkpLFxuICBjZXJ0OiBmcy5yZWFkRmlsZVN5bmMocHJvY2Vzcy5lbnYuU1NMX0NFUlQpXG59XG5cbmNvbnN0IGNob2ljZVByb3RvY29sID0gKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSA/IFtodHRwcywgc3NsXSA6IFtodHRwLCB7fV1cblxuY29uc3Qgc2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKGNob2ljZVByb3RvY29sWzFdLCBhcHApXG5cbnNlcnZlci5saXN0ZW4ocG9ydCwgJzAuMC4wLjAnKVxuc2VydmVyLm9uKCdlcnJvcicsIG9uRXJyb3IpXG5zZXJ2ZXIub24oJ2xpc3RlbmluZycsIG9uTGlzdGVuaW5nKVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIHBvcnQgaW50byBhIG51bWJlciwgc3RyaW5nLCBvciBmYWxzZS5cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemVQb3J0KHZhbCkge1xuICB2YXIgcG9ydCA9IHBhcnNlSW50KHZhbCwgMTApXG5cbiAgaWYgKGlzTmFOKHBvcnQpKSB7XG4gICAgLy8gbmFtZWQgcGlwZVxuICAgIHJldHVybiB2YWxcbiAgfVxuXG4gIGlmIChwb3J0ID49IDApIHtcbiAgICAvLyBwb3J0IG51bWJlclxuICAgIHJldHVybiBwb3J0XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJlcnJvclwiIGV2ZW50LlxuICovXG5cbmZ1bmN0aW9uIG9uRXJyb3IoZXJyb3IpIHtcbiAgaWYgKGVycm9yLnN5c2NhbGwgIT09ICdsaXN0ZW4nKSB7XG4gICAgdGhyb3cgZXJyb3JcbiAgfVxuXG4gIHZhciBiaW5kID0gdHlwZW9mIHBvcnQgPT09ICdzdHJpbmcnID9cbiAgICAnUGlwZSAnICsgcG9ydCA6XG4gICAgJ1BvcnQgJyArIHBvcnRcblxuICAvLyBoYW5kbGUgc3BlY2lmaWMgbGlzdGVuIGVycm9ycyB3aXRoIGZyaWVuZGx5IG1lc3NhZ2VzXG4gIHN3aXRjaCAoZXJyb3IuY29kZSkge1xuICAgIGNhc2UgJ0VBQ0NFUyc6XG4gICAgICBjb25zb2xlLmVycm9yKGJpbmQgKyAnIHJlcXVpcmVzIGVsZXZhdGVkIHByaXZpbGVnZXMnKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ0VBRERSSU5VU0UnOlxuICAgICAgY29uc29sZS5lcnJvcihiaW5kICsgJyBpcyBhbHJlYWR5IGluIHVzZScpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IGVycm9yXG4gIH1cbn1cblxuLyoqXG4gKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJsaXN0ZW5pbmdcIiBldmVudC5cbiAqL1xuXG5mdW5jdGlvbiBvbkxpc3RlbmluZygpIHtcbiAgdmFyIGFkZHIgPSBzZXJ2ZXIuYWRkcmVzcygpXG4gIHZhciBiaW5kID0gdHlwZW9mIGFkZHIgPT09ICdzdHJpbmcnID9cbiAgICAncGlwZSAnICsgYWRkciA6XG4gICAgJ3BvcnQgJyArIGFkZHIucG9ydFxuICBkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKVxufVxuIl19