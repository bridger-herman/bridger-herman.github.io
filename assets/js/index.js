function init() {
  // Set up navigation
  let defaultPage = 'about'
  if (window.location.hash !== '#' + defaultPage) {
    window.location.hash = '#' + defaultPage;
  }
  $('nav ul li a[href="' + window.location.hash + '"]').parent().addClass('active');
  $(window).on('hashchange', function() {
    $('nav ul li a').parent().removeClass('active');
    $('nav ul li a[href="' + window.location.hash + '"]').parent().addClass('active');
  });

  // Set up header items
}

document.onload = init();
