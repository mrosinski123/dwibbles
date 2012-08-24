$('#register').bind('click', function() {
  var email = $('#email').val();
  var password = $('#password').val();

  ss.rpc('auth.register', email, password, function(err, data) {
    if (data.status === 'already registered')
      $('#register-form').before(ss.tmpl['register-already'].render()); 
    if (data.status === 'granted') {
      renderGrantedTemplates(data);
    }
  });
});
$('#login').bind('click', function() {
  var email = $('#login-email').val();
  var password = $('#login-password').val();

  ss.rpc('auth.authenticate', email, password, function(err, data) {
    if (data.status === 'granted') {
      renderGrantedTemplates(data);
    }
  });
});

var renderGrantedTemplates = function(data) {
  $('#dashboard').html(ss.tmpl['home'].render()); 
  $('#account').html(ss.tmpl['navbar-account'].render({email: data.email, services: data.services})); 
  $('#logout').bind('click', function() {
    ss.rpc('auth.logout');
  });
}
