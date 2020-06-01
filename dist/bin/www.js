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

const server = _https.default.createServer({}, _server.default);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vd3d3LmpzIl0sIm5hbWVzIjpbImRlYnVnIiwicG9ydCIsIm5vcm1hbGl6ZVBvcnQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsImFwcCIsInNldCIsInNzbCIsImtleSIsImZzIiwicmVhZEZpbGVTeW5jIiwiU1NMX0tFWSIsImNlcnQiLCJTU0xfQ0VSVCIsImNob2ljZVByb3RvY29sIiwiTk9ERV9FTlYiLCJodHRwcyIsImh0dHAiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJsaXN0ZW4iLCJvbiIsIm9uRXJyb3IiLCJvbkxpc3RlbmluZyIsInZhbCIsInBhcnNlSW50IiwiaXNOYU4iLCJlcnJvciIsInN5c2NhbGwiLCJiaW5kIiwiY29kZSIsImNvbnNvbGUiLCJleGl0IiwiYWRkciIsImFkZHJlc3MiXSwibWFwcGluZ3MiOiJBQUFBO0FBRUE7O0FBQ0E7Ozs7O0FBS0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQSxNQUFNQSxLQUFLLEdBQUcsb0JBQVMsb0JBQVQsQ0FBZCxDLENBQ0E7O0FBRUE7Ozs7QUFJQSxJQUFJQyxJQUFJLEdBQUdDLGFBQWEsQ0FBQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLElBQVosSUFBb0IsTUFBckIsQ0FBeEI7O0FBQ0FDLGdCQUFJQyxHQUFKLENBQVEsTUFBUixFQUFnQk4sSUFBaEI7QUFFQTs7O0FBSUE7O0FBRUE7Ozs7O0FBSUEsTUFBTU8sR0FBRyxHQUFHO0FBQ1ZDLEVBQUFBLEdBQUcsRUFBRUMsWUFBR0MsWUFBSCxDQUFnQlIsT0FBTyxDQUFDQyxHQUFSLENBQVlRLE9BQTVCLENBREs7QUFFVkMsRUFBQUEsSUFBSSxFQUFFSCxZQUFHQyxZQUFILENBQWdCUixPQUFPLENBQUNDLEdBQVIsQ0FBWVUsUUFBNUI7QUFGSSxDQUFaO0FBS0EsTUFBTUMsY0FBYyxHQUFJWixPQUFPLENBQUNDLEdBQVIsQ0FBWVksUUFBWixLQUF5QixhQUExQixHQUEyQyxDQUFDQyxjQUFELEVBQVFULEdBQVIsQ0FBM0MsR0FBMEQsQ0FBQ1UsYUFBRCxFQUFPLEVBQVAsQ0FBakY7O0FBRUEsTUFBTUMsTUFBTSxHQUFHRixlQUFNRyxZQUFOLENBQW1CLEVBQW5CLEVBQXVCZCxlQUF2QixDQUFmOztBQUVBYSxNQUFNLENBQUNFLE1BQVAsQ0FBY3BCLElBQWQsRUFBb0IsU0FBcEI7QUFDQWtCLE1BQU0sQ0FBQ0csRUFBUCxDQUFVLE9BQVYsRUFBbUJDLE9BQW5CO0FBQ0FKLE1BQU0sQ0FBQ0csRUFBUCxDQUFVLFdBQVYsRUFBdUJFLFdBQXZCO0FBRUE7Ozs7QUFJQSxTQUFTdEIsYUFBVCxDQUF1QnVCLEdBQXZCLEVBQTRCO0FBQzFCLE1BQUl4QixJQUFJLEdBQUd5QixRQUFRLENBQUNELEdBQUQsRUFBTSxFQUFOLENBQW5COztBQUVBLE1BQUlFLEtBQUssQ0FBQzFCLElBQUQsQ0FBVCxFQUFpQjtBQUNmO0FBQ0EsV0FBT3dCLEdBQVA7QUFDRDs7QUFFRCxNQUFJeEIsSUFBSSxJQUFJLENBQVosRUFBZTtBQUNiO0FBQ0EsV0FBT0EsSUFBUDtBQUNEOztBQUVELFNBQU8sS0FBUDtBQUNEO0FBRUQ7Ozs7O0FBSUEsU0FBU3NCLE9BQVQsQ0FBaUJLLEtBQWpCLEVBQXdCO0FBQ3RCLE1BQUlBLEtBQUssQ0FBQ0MsT0FBTixLQUFrQixRQUF0QixFQUFnQztBQUM5QixVQUFNRCxLQUFOO0FBQ0Q7O0FBRUQsTUFBSUUsSUFBSSxHQUFHLE9BQU83QixJQUFQLEtBQWdCLFFBQWhCLEdBQ1QsVUFBVUEsSUFERCxHQUVULFVBQVVBLElBRlosQ0FMc0IsQ0FTdEI7O0FBQ0EsVUFBUTJCLEtBQUssQ0FBQ0csSUFBZDtBQUNFLFNBQUssUUFBTDtBQUNFQyxNQUFBQSxPQUFPLENBQUNKLEtBQVIsQ0FBY0UsSUFBSSxHQUFHLCtCQUFyQjtBQUNBM0IsTUFBQUEsT0FBTyxDQUFDOEIsSUFBUixDQUFhLENBQWI7QUFDQTs7QUFDRixTQUFLLFlBQUw7QUFDRUQsTUFBQUEsT0FBTyxDQUFDSixLQUFSLENBQWNFLElBQUksR0FBRyxvQkFBckI7QUFDQTNCLE1BQUFBLE9BQU8sQ0FBQzhCLElBQVIsQ0FBYSxDQUFiO0FBQ0E7O0FBQ0Y7QUFDRSxZQUFNTCxLQUFOO0FBVko7QUFZRDtBQUVEOzs7OztBQUlBLFNBQVNKLFdBQVQsR0FBdUI7QUFDckIsTUFBSVUsSUFBSSxHQUFHZixNQUFNLENBQUNnQixPQUFQLEVBQVg7QUFDQSxNQUFJTCxJQUFJLEdBQUcsT0FBT0ksSUFBUCxLQUFnQixRQUFoQixHQUNULFVBQVVBLElBREQsR0FFVCxVQUFVQSxJQUFJLENBQUNqQyxJQUZqQjtBQUdBRCxFQUFBQSxLQUFLLENBQUMsa0JBQWtCOEIsSUFBbkIsQ0FBTDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG4vLyBiaW4vd3d3LmpzXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxuXG5pbXBvcnQgYXBwIGZyb20gJy4uL3NlcnZlcidcbmltcG9ydCBkZWJ1Z0xpYiBmcm9tICdkZWJ1ZydcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnXG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnXG5cbmltcG9ydCBmcyBmcm9tICdmcydcbmNvbnN0IGRlYnVnID0gZGVidWdMaWIoJ2Fuc2tlci1iYWNrOnNlcnZlcicpXG4vLyAuLmdlbmVyYXRlZCBjb2RlIGJcblxuLyoqXG4gKiBHZXQgcG9ydCBmcm9tIGVudmlyb25tZW50IGFuZCBzdG9yZSBpbiBFeHByZXNzLlxuICovXG5cbnZhciBwb3J0ID0gbm9ybWFsaXplUG9ydChwcm9jZXNzLmVudi5QT1JUIHx8ICczMDAwJylcbmFwcC5zZXQoJ3BvcnQnLCBwb3J0KVxuXG4vKipcbiAqIENyZWF0ZSBIVFRQIHNlcnZlci5cbiAqL1xuXG4vLyB2YXIgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwKVxuXG4vKipcbiAqIExpc3RlbiBvbiBwcm92aWRlZCBwb3J0LCBvbiBhbGwgbmV0d29yayBpbnRlcmZhY2VzLlxuICovXG5cbmNvbnN0IHNzbCA9IHtcbiAga2V5OiBmcy5yZWFkRmlsZVN5bmMocHJvY2Vzcy5lbnYuU1NMX0tFWSksXG4gIGNlcnQ6IGZzLnJlYWRGaWxlU3luYyhwcm9jZXNzLmVudi5TU0xfQ0VSVClcbn1cblxuY29uc3QgY2hvaWNlUHJvdG9jb2wgPSAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpID8gW2h0dHBzLCBzc2xdIDogW2h0dHAsIHt9XVxuXG5jb25zdCBzZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoe30sIGFwcClcblxuc2VydmVyLmxpc3Rlbihwb3J0LCAnMC4wLjAuMCcpXG5zZXJ2ZXIub24oJ2Vycm9yJywgb25FcnJvcilcbnNlcnZlci5vbignbGlzdGVuaW5nJywgb25MaXN0ZW5pbmcpXG5cbi8qKlxuICogTm9ybWFsaXplIGEgcG9ydCBpbnRvIGEgbnVtYmVyLCBzdHJpbmcsIG9yIGZhbHNlLlxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVBvcnQodmFsKSB7XG4gIHZhciBwb3J0ID0gcGFyc2VJbnQodmFsLCAxMClcblxuICBpZiAoaXNOYU4ocG9ydCkpIHtcbiAgICAvLyBuYW1lZCBwaXBlXG4gICAgcmV0dXJuIHZhbFxuICB9XG5cbiAgaWYgKHBvcnQgPj0gMCkge1xuICAgIC8vIHBvcnQgbnVtYmVyXG4gICAgcmV0dXJuIHBvcnRcbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEV2ZW50IGxpc3RlbmVyIGZvciBIVFRQIHNlcnZlciBcImVycm9yXCIgZXZlbnQuXG4gKi9cblxuZnVuY3Rpb24gb25FcnJvcihlcnJvcikge1xuICBpZiAoZXJyb3Iuc3lzY2FsbCAhPT0gJ2xpc3RlbicpIHtcbiAgICB0aHJvdyBlcnJvclxuICB9XG5cbiAgdmFyIGJpbmQgPSB0eXBlb2YgcG9ydCA9PT0gJ3N0cmluZycgP1xuICAgICdQaXBlICcgKyBwb3J0IDpcbiAgICAnUG9ydCAnICsgcG9ydFxuXG4gIC8vIGhhbmRsZSBzcGVjaWZpYyBsaXN0ZW4gZXJyb3JzIHdpdGggZnJpZW5kbHkgbWVzc2FnZXNcbiAgc3dpdGNoIChlcnJvci5jb2RlKSB7XG4gICAgY2FzZSAnRUFDQ0VTJzpcbiAgICAgIGNvbnNvbGUuZXJyb3IoYmluZCArICcgcmVxdWlyZXMgZWxldmF0ZWQgcHJpdmlsZWdlcycpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnRUFERFJJTlVTRSc6XG4gICAgICBjb25zb2xlLmVycm9yKGJpbmQgKyAnIGlzIGFscmVhZHkgaW4gdXNlJylcbiAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgZXJyb3JcbiAgfVxufVxuXG4vKipcbiAqIEV2ZW50IGxpc3RlbmVyIGZvciBIVFRQIHNlcnZlciBcImxpc3RlbmluZ1wiIGV2ZW50LlxuICovXG5cbmZ1bmN0aW9uIG9uTGlzdGVuaW5nKCkge1xuICB2YXIgYWRkciA9IHNlcnZlci5hZGRyZXNzKClcbiAgdmFyIGJpbmQgPSB0eXBlb2YgYWRkciA9PT0gJ3N0cmluZycgP1xuICAgICdwaXBlICcgKyBhZGRyIDpcbiAgICAncG9ydCAnICsgYWRkci5wb3J0XG4gIGRlYnVnKCdMaXN0ZW5pbmcgb24gJyArIGJpbmQpXG59XG4iXX0=