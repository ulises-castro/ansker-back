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

const server = _https.default.createServer({}, _server.default); // server.listen(port, '0.0.0.0')


server.listen(80, function () {
  console.log("server is running on port 80");
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vd3d3LmpzIl0sIm5hbWVzIjpbImRlYnVnIiwicG9ydCIsIm5vcm1hbGl6ZVBvcnQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsImFwcCIsInNldCIsInNzbCIsImtleSIsImZzIiwicmVhZEZpbGVTeW5jIiwiU1NMX0tFWSIsImNlcnQiLCJTU0xfQ0VSVCIsImNob2ljZVByb3RvY29sIiwiTk9ERV9FTlYiLCJodHRwcyIsImh0dHAiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJsaXN0ZW4iLCJjb25zb2xlIiwibG9nIiwib24iLCJvbkVycm9yIiwib25MaXN0ZW5pbmciLCJ2YWwiLCJwYXJzZUludCIsImlzTmFOIiwiZXJyb3IiLCJzeXNjYWxsIiwiYmluZCIsImNvZGUiLCJleGl0IiwiYWRkciIsImFkZHJlc3MiXSwibWFwcGluZ3MiOiJBQUFBO0FBRUE7O0FBQ0E7Ozs7O0FBS0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQSxNQUFNQSxLQUFLLEdBQUcsb0JBQVMsb0JBQVQsQ0FBZCxDLENBQ0E7O0FBRUE7Ozs7QUFJQSxJQUFJQyxJQUFJLEdBQUdDLGFBQWEsQ0FBQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLElBQVosSUFBb0IsTUFBckIsQ0FBeEI7O0FBQ0FDLGdCQUFJQyxHQUFKLENBQVEsTUFBUixFQUFnQk4sSUFBaEI7QUFFQTs7O0FBSUE7O0FBRUE7Ozs7O0FBSUEsTUFBTU8sR0FBRyxHQUFHO0FBQ1ZDLEVBQUFBLEdBQUcsRUFBRUMsWUFBR0MsWUFBSCxDQUFnQlIsT0FBTyxDQUFDQyxHQUFSLENBQVlRLE9BQTVCLENBREs7QUFFVkMsRUFBQUEsSUFBSSxFQUFFSCxZQUFHQyxZQUFILENBQWdCUixPQUFPLENBQUNDLEdBQVIsQ0FBWVUsUUFBNUI7QUFGSSxDQUFaO0FBS0EsTUFBTUMsY0FBYyxHQUFJWixPQUFPLENBQUNDLEdBQVIsQ0FBWVksUUFBWixLQUF5QixhQUExQixHQUEyQyxDQUFDQyxjQUFELEVBQVFULEdBQVIsQ0FBM0MsR0FBMEQsQ0FBQ1UsYUFBRCxFQUFPLEVBQVAsQ0FBakY7O0FBRUEsTUFBTUMsTUFBTSxHQUFHRixlQUFNRyxZQUFOLENBQW1CLEVBQW5CLEVBQXVCZCxlQUF2QixDQUFmLEMsQ0FFQTs7O0FBQ0FhLE1BQU0sQ0FBQ0UsTUFBUCxDQUFjLEVBQWQsRUFBaUIsWUFBVTtBQUN6QkMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksOEJBQVo7QUFDRCxDQUZEO0FBS0FKLE1BQU0sQ0FBQ0ssRUFBUCxDQUFVLE9BQVYsRUFBbUJDLE9BQW5CO0FBQ0FOLE1BQU0sQ0FBQ0ssRUFBUCxDQUFVLFdBQVYsRUFBdUJFLFdBQXZCO0FBRUE7Ozs7QUFJQSxTQUFTeEIsYUFBVCxDQUF1QnlCLEdBQXZCLEVBQTRCO0FBQzFCLE1BQUkxQixJQUFJLEdBQUcyQixRQUFRLENBQUNELEdBQUQsRUFBTSxFQUFOLENBQW5COztBQUVBLE1BQUlFLEtBQUssQ0FBQzVCLElBQUQsQ0FBVCxFQUFpQjtBQUNmO0FBQ0EsV0FBTzBCLEdBQVA7QUFDRDs7QUFFRCxNQUFJMUIsSUFBSSxJQUFJLENBQVosRUFBZTtBQUNiO0FBQ0EsV0FBT0EsSUFBUDtBQUNEOztBQUVELFNBQU8sS0FBUDtBQUNEO0FBRUQ7Ozs7O0FBSUEsU0FBU3dCLE9BQVQsQ0FBaUJLLEtBQWpCLEVBQXdCO0FBQ3RCLE1BQUlBLEtBQUssQ0FBQ0MsT0FBTixLQUFrQixRQUF0QixFQUFnQztBQUM5QixVQUFNRCxLQUFOO0FBQ0Q7O0FBRUQsTUFBSUUsSUFBSSxHQUFHLE9BQU8vQixJQUFQLEtBQWdCLFFBQWhCLEdBQ1QsVUFBVUEsSUFERCxHQUVULFVBQVVBLElBRlosQ0FMc0IsQ0FTdEI7O0FBQ0EsVUFBUTZCLEtBQUssQ0FBQ0csSUFBZDtBQUNFLFNBQUssUUFBTDtBQUNFWCxNQUFBQSxPQUFPLENBQUNRLEtBQVIsQ0FBY0UsSUFBSSxHQUFHLCtCQUFyQjtBQUNBN0IsTUFBQUEsT0FBTyxDQUFDK0IsSUFBUixDQUFhLENBQWI7QUFDQTs7QUFDRixTQUFLLFlBQUw7QUFDRVosTUFBQUEsT0FBTyxDQUFDUSxLQUFSLENBQWNFLElBQUksR0FBRyxvQkFBckI7QUFDQTdCLE1BQUFBLE9BQU8sQ0FBQytCLElBQVIsQ0FBYSxDQUFiO0FBQ0E7O0FBQ0Y7QUFDRSxZQUFNSixLQUFOO0FBVko7QUFZRDtBQUVEOzs7OztBQUlBLFNBQVNKLFdBQVQsR0FBdUI7QUFDckIsTUFBSVMsSUFBSSxHQUFHaEIsTUFBTSxDQUFDaUIsT0FBUCxFQUFYO0FBQ0EsTUFBSUosSUFBSSxHQUFHLE9BQU9HLElBQVAsS0FBZ0IsUUFBaEIsR0FDVCxVQUFVQSxJQURELEdBRVQsVUFBVUEsSUFBSSxDQUFDbEMsSUFGakI7QUFHQUQsRUFBQUEsS0FBSyxDQUFDLGtCQUFrQmdDLElBQW5CLENBQUw7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuLy8gYmluL3d3dy5qc1xuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cblxuaW1wb3J0IGFwcCBmcm9tICcuLi9zZXJ2ZXInXG5pbXBvcnQgZGVidWdMaWIgZnJvbSAnZGVidWcnXG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJ1xuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJ1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5jb25zdCBkZWJ1ZyA9IGRlYnVnTGliKCdhbnNrZXItYmFjazpzZXJ2ZXInKVxuLy8gLi5nZW5lcmF0ZWQgY29kZSBiXG5cbi8qKlxuICogR2V0IHBvcnQgZnJvbSBlbnZpcm9ubWVudCBhbmQgc3RvcmUgaW4gRXhwcmVzcy5cbiAqL1xuXG52YXIgcG9ydCA9IG5vcm1hbGl6ZVBvcnQocHJvY2Vzcy5lbnYuUE9SVCB8fCAnMzAwMCcpXG5hcHAuc2V0KCdwb3J0JywgcG9ydClcblxuLyoqXG4gKiBDcmVhdGUgSFRUUCBzZXJ2ZXIuXG4gKi9cblxuLy8gdmFyIHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcClcblxuLyoqXG4gKiBMaXN0ZW4gb24gcHJvdmlkZWQgcG9ydCwgb24gYWxsIG5ldHdvcmsgaW50ZXJmYWNlcy5cbiAqL1xuXG5jb25zdCBzc2wgPSB7XG4gIGtleTogZnMucmVhZEZpbGVTeW5jKHByb2Nlc3MuZW52LlNTTF9LRVkpLFxuICBjZXJ0OiBmcy5yZWFkRmlsZVN5bmMocHJvY2Vzcy5lbnYuU1NMX0NFUlQpXG59XG5cbmNvbnN0IGNob2ljZVByb3RvY29sID0gKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSA/IFtodHRwcywgc3NsXSA6IFtodHRwLCB7fV1cblxuY29uc3Qgc2VydmVyID0gaHR0cHMuY3JlYXRlU2VydmVyKHt9LCBhcHApXG5cbi8vIHNlcnZlci5saXN0ZW4ocG9ydCwgJzAuMC4wLjAnKVxuc2VydmVyLmxpc3Rlbig4MCxmdW5jdGlvbigpe1xuICBjb25zb2xlLmxvZyhcInNlcnZlciBpcyBydW5uaW5nIG9uIHBvcnQgODBcIik7XG59KVxuXG5cbnNlcnZlci5vbignZXJyb3InLCBvbkVycm9yKVxuc2VydmVyLm9uKCdsaXN0ZW5pbmcnLCBvbkxpc3RlbmluZylcblxuLyoqXG4gKiBOb3JtYWxpemUgYSBwb3J0IGludG8gYSBudW1iZXIsIHN0cmluZywgb3IgZmFsc2UuXG4gKi9cblxuZnVuY3Rpb24gbm9ybWFsaXplUG9ydCh2YWwpIHtcbiAgdmFyIHBvcnQgPSBwYXJzZUludCh2YWwsIDEwKVxuXG4gIGlmIChpc05hTihwb3J0KSkge1xuICAgIC8vIG5hbWVkIHBpcGVcbiAgICByZXR1cm4gdmFsXG4gIH1cblxuICBpZiAocG9ydCA+PSAwKSB7XG4gICAgLy8gcG9ydCBudW1iZXJcbiAgICByZXR1cm4gcG9ydFxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogRXZlbnQgbGlzdGVuZXIgZm9yIEhUVFAgc2VydmVyIFwiZXJyb3JcIiBldmVudC5cbiAqL1xuXG5mdW5jdGlvbiBvbkVycm9yKGVycm9yKSB7XG4gIGlmIChlcnJvci5zeXNjYWxsICE9PSAnbGlzdGVuJykge1xuICAgIHRocm93IGVycm9yXG4gIH1cblxuICB2YXIgYmluZCA9IHR5cGVvZiBwb3J0ID09PSAnc3RyaW5nJyA/XG4gICAgJ1BpcGUgJyArIHBvcnQgOlxuICAgICdQb3J0ICcgKyBwb3J0XG5cbiAgLy8gaGFuZGxlIHNwZWNpZmljIGxpc3RlbiBlcnJvcnMgd2l0aCBmcmllbmRseSBtZXNzYWdlc1xuICBzd2l0Y2ggKGVycm9yLmNvZGUpIHtcbiAgICBjYXNlICdFQUNDRVMnOlxuICAgICAgY29uc29sZS5lcnJvcihiaW5kICsgJyByZXF1aXJlcyBlbGV2YXRlZCBwcml2aWxlZ2VzJylcbiAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdFQUREUklOVVNFJzpcbiAgICAgIGNvbnNvbGUuZXJyb3IoYmluZCArICcgaXMgYWxyZWFkeSBpbiB1c2UnKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBlcnJvclxuICB9XG59XG5cbi8qKlxuICogRXZlbnQgbGlzdGVuZXIgZm9yIEhUVFAgc2VydmVyIFwibGlzdGVuaW5nXCIgZXZlbnQuXG4gKi9cblxuZnVuY3Rpb24gb25MaXN0ZW5pbmcoKSB7XG4gIHZhciBhZGRyID0gc2VydmVyLmFkZHJlc3MoKVxuICB2YXIgYmluZCA9IHR5cGVvZiBhZGRyID09PSAnc3RyaW5nJyA/XG4gICAgJ3BpcGUgJyArIGFkZHIgOlxuICAgICdwb3J0ICcgKyBhZGRyLnBvcnRcbiAgZGVidWcoJ0xpc3RlbmluZyBvbiAnICsgYmluZClcbn1cbiJdfQ==