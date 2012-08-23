exports.authenticated = function() {
  return function(req, res, next) {
    if (req.session && (req.session.userId != null)) {
      return next();
    } else {
      return res(false);
    }
  };
};
