var initHMACAuth = function() {
  $("<input class=\"hmac_auth\" value=\"Auth me!\"type=\"button\">").insertAfter( "input[value='Try it out!']" );
  
  $(document).on('click', '.hmac_auth', function() {
    setHMACparams(this);
  })
};

var setHMACparams = function(btn) {
  var form = $(btn).parent().parent();
  var block = form.parent().parent();
  
  var method = block.find('.http_method a').text().toUpperCase();
  var path = '/api' + block.find('.path a').text();
  
  var access_key = $('#input_accessKey').val();
  var secret_key = $('#input_secretKey').val();
  var tonce = jQuery.now();

  form.find('input[name="access_key"]').val(access_key);
  form.find('input[name="tonce"]').val(tonce);
  
  var payload = method+"|"+path;
  var inputs = form.find('input[type=text]:not([name=signature]):not([name=tonce]), select');
  var params = {};
  $.each(inputs, function(i, el) {
    if( $(el).val() != '' ) {
      params[$(el).attr('name')] = $(el).val();
    }
  });
  params['tonce'] = tonce;
  
  var ordered_params = {};
  Object.keys(params).sort().forEach(function(key) {
    ordered_params[key] = params[key];
  });
  
  payload += '|' + jQuery.param(ordered_params);
  var signature = CryptoJS.HmacSHA256(payload, secret_key).toString(CryptoJS.enc.Hex)
  form.find('input[name="signature"]').val(signature);
}