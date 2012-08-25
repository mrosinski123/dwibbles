ss.rpc('auth.getSession', function(err, data) {
  if (data.status === 'granted') {
    $('#account').html(ss.tmpl['navbar-account'].render({email: data.email, services: data.services})); 
    $('#dashboard').html(ss.tmpl['home'].render());
    require('/services');
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
