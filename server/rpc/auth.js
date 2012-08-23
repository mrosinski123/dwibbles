exports.actions = function(req, res, ss) {

  req.use('session');
  req.use('debug');

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
              res(null, 'already registered');
            } else {
              // XXX We need to encrypt the password.
              var user = new User({email: email, password: password});
              user.save(function (err, user) {
                if (!err) {
                  req.session.setUserId(user._id.toString());
                  res(null, 'granted');
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
              console.log('hello');
              req.session.setUserId(qry[0]._id.toString());
              req.session.email = qry[0].email;
              req.session.save();
              res(null, 'granted', req.session.email)
            } else {
              res(null, 'denied', null)
            }
          } else {
            res(err, null, null);
          }
        });
    },
    getSession: function() {
      if (req.session && req.session.userId) {
        res(null, 'granted', req.session.email);
        return true;
      }
      res(null, 'denied', null);
    },
    logout: function() {
      req.session.setUserId(null);
      res(null, null);
    }
  };
};

