var services = {
  twitter: function() {
    ss.rpc('services.getTwitter', function(err, data) {

      $.each(data, function(k, v) {
        var dwibble = {
          text: v.text,
          created_on: '',
          username: v.user.screen_name,
          profile_image_url: v.user.profile_image_url
        }

        $('#dashboard').append(ss.tmpl['dwibble'].render(dwibble)); 
      });

    });
  },
  facebook: function() {
    ss.rpc('services.getFacebook', function(err, data) {
      console.log(data);
      $.each(data, function(k, v) {
        var dwibble = {
          text: v.story || v.message || v.name,
          created_on: v.created_time,
          username: v.from.name,
          profile_image_url: 'https://graph.facebook.com/'+v.from.id+'/picture'
        };

        $('#dashboard').append(ss.tmpl['dwibble'].render(dwibble));
      });
    });
  }
}


ss.rpc('services.getServices', function(err, data) {
  $.each(data, function(k, v) {
    services[k]();
  });
});
