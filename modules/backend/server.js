let server;

module.exports = function(srv) {
  if (srv) {
    server = srv;
  } else {
    return server;
  }
}