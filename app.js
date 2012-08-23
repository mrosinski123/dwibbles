var http = require('http');
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'dwibbles');
var ss = require('socketstream');
var ea = require('everyauth');


// Add mongodb connection to socketstream internal api.
ss.api.add('db', db);
ss.api.add('mongoose', mongoose);


// Use redis store
ss.session.store.use('redis');

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/bootstrap.css'],
  code: ['libs/jquery.min.js', 'libs/bootstrap.js', 'app'],
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
    var userName = twitterUserMetadata.screen_name;
    console.log('Twitter Username is', userName);
    session.userId = userName;
    session.save();
    return true;
  })
  .redirectPath('/')

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

ss.http.middleware.prepend(ss.http.connect.bodyParser());
ss.http.middleware.append(ea.middleware());

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(3000);

// Start SocketStream
ss.start(server);
