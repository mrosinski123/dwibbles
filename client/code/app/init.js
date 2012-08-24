ss.rpc('auth.getSession', function(err, data) {
  console.log(data);
  if (data.status === 'granted') {
    $('#account').html(ss.tmpl['navbar-account'].render({email: data.email, services: data.services})); 
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
