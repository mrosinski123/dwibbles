ss.rpc('services.getTimeline', function(err, data) {
  console.log(data[0]);

  $.each(data, function(k, v) {
    $('#dashboard').append(ss.tmpl['dwibble'].render(v)); 
  });

});
