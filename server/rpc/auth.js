exports.actions = function(req, res, ss) {

  req.use('session');

  var userSchema = new ss.mongoose.Schema({
    email: String,
    password: String
  });
  var User = ss.db.model('User', userSchema)

  return {
    register: function(email, password) {
      User
        .find({email: email})
        .where('email').equals(email)
        .exec(function(err, qry) {
          if (!err) {
            if (qry[0]) {
              res(null, {status: 'already registered'});
            } else {
              // XXX We need to encrypt the password.
              var user = new User({email: email, password: password});
              user.save(function (err, user) {
                if (!err) {
                  req.session.setUserId(user._id.toString());
                  req.session.email = user.email;
                  req.session.services = req.session.services || {};
                  req.session.save();
                  res(null, {status: 'granted', email: email});
                } else {
                  res(err, null);
                }
              });
            }
          } else {
            res(err, null);
          }
        });
    },
    authenticate: function(email, password) {
      User
        .find({email: email})
        .where('email').equals(email)
        .where('password').equals(password)
        .exec(function(err, qry) {
          if (!err) {
            if (qry[0]) {
              req.session.setUserId(qry[0]._id.toString());
              req.session.email = qry[0].email
              req.session.services = req.session.services || {};
              req.session.save();
              res(null, {status: 'granted', email: req.session.email, services: req.session.services})
            } else {
              res(null, {status: 'denied'})
            }
          } else {
            res(err, null, null);
          }
        });
    },
    getSession: function() {
      if (req.session && req.session.userId) {
        res(null, {status: 'granted', email: req.session.email, services: req.session.services});
        return true;
      }
      res(null, {status: 'denied'});
    },
    logout: function() {
      req.session.setUserId(null);
      res(null, null);
    }
  };
};

