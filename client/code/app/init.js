ss.rpc('auth.getSession', function(err, data, email) {
  if (data === 'granted') {
    $('#dashboard').html(ss.tmpl['home'].render());
    $('#account').html(ss.tmpl['navbar-account'].render({email: email})); 
    $('#logout').bind('click', function() {
      ss.rpc('auth.logout', function(err, data) {
        $('#dashboard').html(ss.tmpl['intro'].render());
        $('#account').html(ss.tmpl['navbar-login'].render()); 
      });
    });
    return true
  } else {
    $('#dashboard').html(ss.tmpl['intro'].render());
    $('#account').html(ss.tmpl['navbar-login'].render()); 
    require('/register');
  }
});