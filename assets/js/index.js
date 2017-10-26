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
  // console.log($('.fix-pic').width());
  // $('.fix-pic')
  // Set up header items
  // TODO (Lost all functionality when I apparently neglected to push)
}

function fixPic() {
  // <iframe frameborder="0" allowfullscreen="" class="flickr-embed-frame" webkitallowfullscreen="" mozallowfullscreen="" oallowfullscreen="" msallowfullscreen="" width="500" height="331" data-natural-width="500" data-natural-height="331" data-loaded="true" style="overflow: hidden; padding: 0px; margin: 0px; width: 500px; height: 331px; max-width: none;"></iframe>
}

document.onload = init();
