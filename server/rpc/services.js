exports.actions = function(req, res, ss) {

  req.use('session');

  return {
    getTimeline: function() {
      console.log(req.session);
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
    }
  };

};
