var getServices = $.Deferred();
var river = [];

var capitalizeFirstLetter = function(value) {
  return value[0].toUpperCase() + value.slice(1);
}

getServices.done(function(services) {
  var promises = [];

  $.each(services, function(k, v) {
    promises.push(fetchServiceData(k)); 
  });
  if (promises[0] !== undefined) {
    $.when.apply(this, promises)
      .done(function() {
        river = _.sortBy(river, function(data) {return -data.created_on.getTime();});
        for (var i = 0; i <= river.length; i+=1) {
          $('#river').append(ss.tmpl['dwibble'].render(river[i]));
        }
      });
  }
});

var fetchServiceData = function(service) {
  var action = 'services.get' + capitalizeFirstLetter(service);
  var d = $.Deferred();
  
  ss.rpc(action, function(err, data) {
    $.each(data, function(k, v) {
      var profile_image_url = service === 'facebook' ? 'https://graph.facebook.com/' + v.from.id + '/picture' : v.user.profile_image_url;
      var dwibble = {
        service: service,
        text: service === 'facebook' ? v.story || v.message || v.name : v.text,
        created_on: service === 'facebook' ? new Date(v.created_time) : new Date(v.created_at),
        time_ago: service === 'facebook' ? moment(v.created_time).fromNow() : new moment(v.created_at).fromNow(),
        username: service === 'facebook' ? v.from.name : v.user.screen_name,
        profile_image_url: profile_image_url
      };

      river.push(dwibble);
    });
    d.resolve();
  });
  
  return d.promise();
}

ss.rpc('services.getServices', function(err, data) {
  if (!err) {
    if (!$.isEmptyObject(data))
      getServices.resolve(data);
    else 
      $('#river').html(ss.tmpl['empty-river'].render());
  } else {
    console.log(err);
  }
});
