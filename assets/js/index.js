function init() {
  // Set up navigation
  let defaultPage = 'about';
  if (window.location.hash === '') {
      window.location.hash = '#' + defaultPage;
  }
  $('nav ul li a[href="' + window.location.hash +
      '"]').parent().addClass('active');
  $(window).on(
    'hashchange', function() {
      $('nav ul li a').parent().removeClass('active'); $('nav ul li a[href="' +
      window.location.hash + '"]').parent().addClass('active');
    }
  );
  // Set up header items
  setupTTY();
  let headerImg = $('.header-img');
  let header = $('header');
  headerImg.height(header.height());
  headerImg.width(header.height())
}

document.onload = init();
