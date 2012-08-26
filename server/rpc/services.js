exports.actions = function(req, res, ss) {

  req.use('session');

  return {
    getServices: function() {
      res(null, req.session.services);
    },
    getTwitter: function() {
      var oauth = {
        consumer_key: ss.twitterKey,
        consumer_secret: ss.twitterSecret,
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
    },
    postToRiver: function(message) {
      var oauth = {
        consumer_key: ss.twitterKey,
        consumer_secret: ss.twitterSecret,
        token: req.session.auth.twitter.accessToken,
        token_secret: req.session.auth.twitter.accessTokenSecret,
      };
      var url = 'https://api.twitter.com/1/statuses/update.json';
      ss.request.post({url: url, oauth: oauth, json: {status: message}}, function(error, response, data) {
        res(null, data); 
      });
    }
  };

};
