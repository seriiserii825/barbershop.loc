/*active menu
  =======================================*/ 
  $('#js-top-nav_menu li').each(function () {
      var location = window.location.pathname;
      var location = location.substring(1);
      var link = $(this).children('a').attr('href');
      if(location === link) {
          $(this).addClass('active');
      }
  });