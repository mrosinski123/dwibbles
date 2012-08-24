exports.actions = function(req, res, ss) {

  req.use('session');

  return {
    getServices: function() {
      res(null, req.session.services);
    },
    getTwitter: function() {
      var oauth = {
        consumer_key: 'lWc6kG4NPaWYzoKf3M38Ag', 
        consumer_secret: 'at3gb0aWDbzqfIwph8iRnJLGZ37wxwWOLZMRt4Hk',
        token: req.session.auth.twitter.accessToken,
        token_secret: req.session.auth.twitter.accessTokenSecret
      };
      var url = 'http://api.twitter.com/1/statuses/home_timeline.json';
      ss.request({url: url, oauth: oauth}, function(error, response, data) {
        res(null, JSON.parse(data)); 
      });
    },
    getFacebook: function() {
      var url = "https://graph.facebook.com/me/home?access_token="+req.session.auth.facebook.accessToken;
      ss.request(url, function(error, response, data) {
        res(null, JSON.parse(data).data);
      });
    }
  };

};
