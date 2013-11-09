$(function() {

  var $login = $('.login'),
      $loading = $('.loading');

  R.ready(function() {

    if (!R.authenticated()) {
      $login
        .removeClass('hidden')
        .click(function() {
          $login.addClass('hidden');
          R.authenticate(function(res) {
            if (!authenticated) $login.removeClass('hidden');
          });
        });
    } else {
      $login.addClass('hidden');
    }

    $loading.addClass('hidden');

  });

});
