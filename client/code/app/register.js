$('#register').bind('click', function() {
  var email = $('#email').val();
  var password = $('#password').val();

  ss.rpc('auth.register', email, password, function(err, data) {
    if (data === 'already registered')
      $('#register-form').before(ss.tmpl['register-already'].render()); 
    if (data === 'granted') {
      $('#dashboard').html(ss.tmpl['home'].render()); 
      $('#account').html(ss.tmpl['navbar-account'].render({email: email})); 
      $('#logout').bind('click', function() {
        ss.rpc('auth.logout', function(err, data) {
          $('#dashboard').html(ss.tmpl['intro'].render());
          $('#account').html(ss.tmpl['navbar-login'].render()); 
        });
      });
    }
  });
});
$('#login').bind('click', function() {
  var email = $('#login-email').val();
  var password = $('#login-password').val();

  ss.rpc('auth.authenticate', email, password, function(err, data, email) {
    if (data === 'granted') {
      $('#dashboard').html(ss.tmpl['home'].render()); 
      $('#account').html(ss.tmpl['navbar-account'].render({email: email})); 
      $('#logout').bind('click', function() {
        ss.rpc('auth.logout', function(err, data) {
          $('#dashboard').html(ss.tmpl['intro'].render());
          $('#account').html(ss.tmpl['navbar-login'].render()); 
        });
      });
    }
  });
});
