function init() {
  // Set up navigation
  let defaultPage = 'home'
  if (window.location.hash !== '#' + defaultPage) {
    window.location.hash = '#' + defaultPage;
  }
  // $('nav ul li a[href="' + window.location.hash + '"]').addClass('active');
  // $(window).on('hashchange', function() {
  //   $('nav ul li a').removeClass('active');
  //   $('nav ul li a[href="' + window.location.hash + '"]').addClass('active');
  // });

}

document.onload = init();
