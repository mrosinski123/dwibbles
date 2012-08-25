var http = require('http');
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'dwibbles');
var moment = require('moment');
var ss = require('socketstream');
var ea = require('everyauth');
var request = require('request');
var port = 3000;

// Add to internal api.
ss.api.add('db', db);
ss.api.add('mongoose', mongoose);
ss.api.add('ea', ea);
ss.api.add('request', request);
ss.api.add('moment', moment);

// Use redis store
ss.session.store.use('redis');

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/bootstrap.css', 'app.css'],
  code: ['libs/jquery.min.js', 'libs/bootstrap.js', 'libs/moment.js', 'libs/underscore.js', 'app'],
  tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('main');
});

ea.twitter
  .consumerKey('lWc6kG4NPaWYzoKf3M38Ag')
  .consumerSecret('at3gb0aWDbzqfIwph8iRnJLGZ37wxwWOLZMRt4Hk')
  .findOrCreateUser(function(session, accessToken, accessTokenSecret, twitterUserMetadata) {
    session.services.twitter = twitterUserMetadata.screen_name;
    session.save();
    return true;
  })
  .redirectPath('/')

ea.facebook
  .appId('450449624976739')
  .appSecret('e856fdd60f0149e0ecc257914590c1e1')
  .scope('read_stream') 
  .findOrCreateUser(function(session, accessToken, accessTokExtra, fbUserMetadata) {
    session.services.facebook = fbUserMetadata.username;
    session.save();
    return true;
  })
  .redirectPath('/');

// Code Formatters

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') {
    ss.client.packAssets();
    port = 80;
}

ss.http.middleware.prepend(ss.http.connect.bodyParser());
ss.http.middleware.append(ea.middleware());

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(port);

// Start SocketStream
ss.start(server);

