// Server-side Code

// Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {

  req.use('session');
  req.use(checkAuthenticated);

  return {
  };
};

// define custom middleware to ensure user is logged in
checkAuthenticated = function() {
  return function(req, res, next) {
    if (req.session && req.session.userId)
      return next();
    res('Access denied'); // prevent request from continuing
  }
}
