$(function () {
  /*
      https://www.jqueryscript.net/animation/Smooth-Mouse-Wheel-Scrolling-Plugin-With-jQuery-easeScroll.html
      ===========================*/
  $("html").easeScroll({
    frameRate: 60,
    animationTime: 1000,
    stepSize: 90,
    pulseAlgorithm: 1,
    pulseScale: 8,
    pulseNormalize: 1,
    accelerationDelta: 20,
    accelerationMax: 1,
    keyboardSupport: true,
    arrowScroll: 50,
    touchpadSupport: true,
    fixedBackground: true
  });

  let mainNav = $('.main-nav');
  let mainNavToggle = $('.main-nav__toggle');

  mainNav.removeClass('main-nav--no-js');

  if(mainNav.hasClass('main-nav--opened')){
    mainNav.removeClass('main-nav--opened');
    mainNav.addClass('main-nav--closed');
  }

  mainNavToggle.on('click', function(){
    if(mainNav.hasClass('main-nav--closed')){
      mainNav.removeClass('main-nav--closed');
      mainNav.addClass('main-nav--opened');
    }else{
      mainNav.removeClass('main-nav--opened');
      mainNav.addClass('main-nav--closed');
    }
  });
});
