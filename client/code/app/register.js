$('#register, #login').click(function (evt) {
  var email = evt.target.id === 'register' ? $('#email') : $('#login-email');
  var password = evt.target.id === 'register' ? $('#password') : $('#login-password');
  var action = evt.target.id === 'register' ? 'auth.register' : 'auth.authenticate';

  ss.rpc(action, $('#login-email').val(), $('#login-password').val(), function(err, data) {
    if (data.status === 'granted')
      login();
    else if (data.status === 'already registered')
      $('#register-form').before(ss.tmpl['register-already'].render()); 
  });
});

var login = function() {
  window.location.href = "/";
  $('#logout').bind('click', function() {
    ss.rpc('auth.logout');
  });
}
