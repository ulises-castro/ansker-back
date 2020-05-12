#!/usr/bin/env node
// bin/www.js

/**
 * Module dependencies.
 */
"use strict";

var _app = _interopRequireDefault(require("../app"));

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

_app.default.set('port', port);
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
const choiceProtocol = !JSON.parse(process.env.PRODUCTION) ? [_https.default, ssl] : [_http.default, {}];

const server = _https.default.createServer(choiceProtocol[1], _app.default);

server.listen(port);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vd3d3LmpzIl0sIm5hbWVzIjpbImRlYnVnIiwicG9ydCIsIm5vcm1hbGl6ZVBvcnQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsImFwcCIsInNldCIsInNzbCIsImtleSIsImZzIiwicmVhZEZpbGVTeW5jIiwiU1NMX0tFWSIsImNlcnQiLCJTU0xfQ0VSVCIsImNob2ljZVByb3RvY29sIiwiSlNPTiIsInBhcnNlIiwiUFJPRFVDVElPTiIsImh0dHBzIiwiaHR0cCIsInNlcnZlciIsImNyZWF0ZVNlcnZlciIsImxpc3RlbiIsIm9uIiwib25FcnJvciIsIm9uTGlzdGVuaW5nIiwidmFsIiwicGFyc2VJbnQiLCJpc05hTiIsImVycm9yIiwic3lzY2FsbCIsImJpbmQiLCJjb2RlIiwiY29uc29sZSIsImV4aXQiLCJhZGRyIiwiYWRkcmVzcyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFFQTs7QUFDQTs7Ozs7QUFLQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7OztBQUNBLE1BQU1BLEtBQUssR0FBRyxvQkFBUyxvQkFBVCxDQUFkLEMsQ0FDQTs7QUFFQTs7OztBQUlBLElBQUlDLElBQUksR0FBR0MsYUFBYSxDQUFDQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsSUFBWixJQUFvQixNQUFyQixDQUF4Qjs7QUFDQUMsYUFBSUMsR0FBSixDQUFRLE1BQVIsRUFBZ0JOLElBQWhCO0FBRUE7OztBQUlBOztBQUVBOzs7OztBQUlBLE1BQU1PLEdBQUcsR0FBRztBQUNWQyxFQUFBQSxHQUFHLEVBQUVDLFlBQUdDLFlBQUgsQ0FBZ0JSLE9BQU8sQ0FBQ0MsR0FBUixDQUFZUSxPQUE1QixDQURLO0FBRVZDLEVBQUFBLElBQUksRUFBRUgsWUFBR0MsWUFBSCxDQUFnQlIsT0FBTyxDQUFDQyxHQUFSLENBQVlVLFFBQTVCO0FBRkksQ0FBWjtBQUtBLE1BQU1DLGNBQWMsR0FBRyxDQUFDQyxJQUFJLENBQUNDLEtBQUwsQ0FBV2QsT0FBTyxDQUFDQyxHQUFSLENBQVljLFVBQXZCLENBQUQsR0FBc0MsQ0FBQ0MsY0FBRCxFQUFRWCxHQUFSLENBQXRDLEdBQXFELENBQUNZLGFBQUQsRUFBTyxFQUFQLENBQTVFOztBQUVBLE1BQU1DLE1BQU0sR0FBR0YsZUFBTUcsWUFBTixDQUFtQlAsY0FBYyxDQUFDLENBQUQsQ0FBakMsRUFBc0NULFlBQXRDLENBQWY7O0FBRUFlLE1BQU0sQ0FBQ0UsTUFBUCxDQUFjdEIsSUFBZDtBQUNBb0IsTUFBTSxDQUFDRyxFQUFQLENBQVUsT0FBVixFQUFtQkMsT0FBbkI7QUFDQUosTUFBTSxDQUFDRyxFQUFQLENBQVUsV0FBVixFQUF1QkUsV0FBdkI7QUFFQTs7OztBQUlBLFNBQVN4QixhQUFULENBQXVCeUIsR0FBdkIsRUFBNEI7QUFDMUIsTUFBSTFCLElBQUksR0FBRzJCLFFBQVEsQ0FBQ0QsR0FBRCxFQUFNLEVBQU4sQ0FBbkI7O0FBRUEsTUFBSUUsS0FBSyxDQUFDNUIsSUFBRCxDQUFULEVBQWlCO0FBQ2Y7QUFDQSxXQUFPMEIsR0FBUDtBQUNEOztBQUVELE1BQUkxQixJQUFJLElBQUksQ0FBWixFQUFlO0FBQ2I7QUFDQSxXQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsU0FBTyxLQUFQO0FBQ0Q7QUFFRDs7Ozs7QUFJQSxTQUFTd0IsT0FBVCxDQUFpQkssS0FBakIsRUFBd0I7QUFDdEIsTUFBSUEsS0FBSyxDQUFDQyxPQUFOLEtBQWtCLFFBQXRCLEVBQWdDO0FBQzlCLFVBQU1ELEtBQU47QUFDRDs7QUFFRCxNQUFJRSxJQUFJLEdBQUcsT0FBTy9CLElBQVAsS0FBZ0IsUUFBaEIsR0FDVCxVQUFVQSxJQURELEdBRVQsVUFBVUEsSUFGWixDQUxzQixDQVN0Qjs7QUFDQSxVQUFRNkIsS0FBSyxDQUFDRyxJQUFkO0FBQ0UsU0FBSyxRQUFMO0FBQ0VDLE1BQUFBLE9BQU8sQ0FBQ0osS0FBUixDQUFjRSxJQUFJLEdBQUcsK0JBQXJCO0FBQ0E3QixNQUFBQSxPQUFPLENBQUNnQyxJQUFSLENBQWEsQ0FBYjtBQUNBOztBQUNGLFNBQUssWUFBTDtBQUNFRCxNQUFBQSxPQUFPLENBQUNKLEtBQVIsQ0FBY0UsSUFBSSxHQUFHLG9CQUFyQjtBQUNBN0IsTUFBQUEsT0FBTyxDQUFDZ0MsSUFBUixDQUFhLENBQWI7QUFDQTs7QUFDRjtBQUNFLFlBQU1MLEtBQU47QUFWSjtBQVlEO0FBRUQ7Ozs7O0FBSUEsU0FBU0osV0FBVCxHQUF1QjtBQUNyQixNQUFJVSxJQUFJLEdBQUdmLE1BQU0sQ0FBQ2dCLE9BQVAsRUFBWDtBQUNBLE1BQUlMLElBQUksR0FBRyxPQUFPSSxJQUFQLEtBQWdCLFFBQWhCLEdBQ1QsVUFBVUEsSUFERCxHQUVULFVBQVVBLElBQUksQ0FBQ25DLElBRmpCO0FBR0FELEVBQUFBLEtBQUssQ0FBQyxrQkFBa0JnQyxJQUFuQixDQUFMO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbi8vIGJpbi93d3cuanNcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG5cbmltcG9ydCBhcHAgZnJvbSAnLi4vYXBwJ1xuaW1wb3J0IGRlYnVnTGliIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCdcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcydcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuY29uc3QgZGVidWcgPSBkZWJ1Z0xpYignYW5za2VyLWJhY2s6c2VydmVyJylcbi8vIC4uZ2VuZXJhdGVkIGNvZGUgYlxuXG4vKipcbiAqIEdldCBwb3J0IGZyb20gZW52aXJvbm1lbnQgYW5kIHN0b3JlIGluIEV4cHJlc3MuXG4gKi9cblxudmFyIHBvcnQgPSBub3JtYWxpemVQb3J0KHByb2Nlc3MuZW52LlBPUlQgfHwgJzMwMDAnKVxuYXBwLnNldCgncG9ydCcsIHBvcnQpXG5cbi8qKlxuICogQ3JlYXRlIEhUVFAgc2VydmVyLlxuICovXG5cbi8vIHZhciBzZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihhcHApXG5cbi8qKlxuICogTGlzdGVuIG9uIHByb3ZpZGVkIHBvcnQsIG9uIGFsbCBuZXR3b3JrIGludGVyZmFjZXMuXG4gKi9cblxuY29uc3Qgc3NsID0ge1xuICBrZXk6IGZzLnJlYWRGaWxlU3luYyhwcm9jZXNzLmVudi5TU0xfS0VZKSxcbiAgY2VydDogZnMucmVhZEZpbGVTeW5jKHByb2Nlc3MuZW52LlNTTF9DRVJUKVxufVxuXG5jb25zdCBjaG9pY2VQcm90b2NvbCA9ICFKU09OLnBhcnNlKHByb2Nlc3MuZW52LlBST0RVQ1RJT04pID8gW2h0dHBzLCBzc2xdIDogW2h0dHAsIHt9XVxuXG5jb25zdCBzZXJ2ZXIgPSBodHRwcy5jcmVhdGVTZXJ2ZXIoY2hvaWNlUHJvdG9jb2xbMV0sIGFwcClcblxuc2VydmVyLmxpc3Rlbihwb3J0KVxuc2VydmVyLm9uKCdlcnJvcicsIG9uRXJyb3IpXG5zZXJ2ZXIub24oJ2xpc3RlbmluZycsIG9uTGlzdGVuaW5nKVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIHBvcnQgaW50byBhIG51bWJlciwgc3RyaW5nLCBvciBmYWxzZS5cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemVQb3J0KHZhbCkge1xuICB2YXIgcG9ydCA9IHBhcnNlSW50KHZhbCwgMTApXG5cbiAgaWYgKGlzTmFOKHBvcnQpKSB7XG4gICAgLy8gbmFtZWQgcGlwZVxuICAgIHJldHVybiB2YWxcbiAgfVxuXG4gIGlmIChwb3J0ID49IDApIHtcbiAgICAvLyBwb3J0IG51bWJlclxuICAgIHJldHVybiBwb3J0XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJlcnJvclwiIGV2ZW50LlxuICovXG5cbmZ1bmN0aW9uIG9uRXJyb3IoZXJyb3IpIHtcbiAgaWYgKGVycm9yLnN5c2NhbGwgIT09ICdsaXN0ZW4nKSB7XG4gICAgdGhyb3cgZXJyb3JcbiAgfVxuXG4gIHZhciBiaW5kID0gdHlwZW9mIHBvcnQgPT09ICdzdHJpbmcnID9cbiAgICAnUGlwZSAnICsgcG9ydCA6XG4gICAgJ1BvcnQgJyArIHBvcnRcblxuICAvLyBoYW5kbGUgc3BlY2lmaWMgbGlzdGVuIGVycm9ycyB3aXRoIGZyaWVuZGx5IG1lc3NhZ2VzXG4gIHN3aXRjaCAoZXJyb3IuY29kZSkge1xuICAgIGNhc2UgJ0VBQ0NFUyc6XG4gICAgICBjb25zb2xlLmVycm9yKGJpbmQgKyAnIHJlcXVpcmVzIGVsZXZhdGVkIHByaXZpbGVnZXMnKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ0VBRERSSU5VU0UnOlxuICAgICAgY29uc29sZS5lcnJvcihiaW5kICsgJyBpcyBhbHJlYWR5IGluIHVzZScpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IGVycm9yXG4gIH1cbn1cblxuLyoqXG4gKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJsaXN0ZW5pbmdcIiBldmVudC5cbiAqL1xuXG5mdW5jdGlvbiBvbkxpc3RlbmluZygpIHtcbiAgdmFyIGFkZHIgPSBzZXJ2ZXIuYWRkcmVzcygpXG4gIHZhciBiaW5kID0gdHlwZW9mIGFkZHIgPT09ICdzdHJpbmcnID9cbiAgICAncGlwZSAnICsgYWRkciA6XG4gICAgJ3BvcnQgJyArIGFkZHIucG9ydFxuICBkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKVxufVxuIl19