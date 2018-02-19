function init() {
  console.log('set things up');
  // Set up header items
  let ttyObjs = setupTTY();
  let headerImg = $('.header-img');
  let header = $('header');
  headerImg.height(header.height());
  headerImg.width(header.height());

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
      $(ttyObjs).each(function(i) {
        $(ttyObjs[i].tty).find('.shell-line').html(getShellLine(window.location.hash));
      });
    }
  );


  // Load page content from files
  loadPages();

  // https://stackoverflow.com/a/18525368
  window.onkeydown = function(e) {
    if (e.keyCode == 32 && $(e.target).hasClass('tty')) {
      e.preventDefault();
    }
  };
}

document.onload = init();
