function init() {
  // Set up header items
  let ttyObjs = setupTTY();

  // https://stackoverflow.com/a/18525368
  window.onkeydown = function(e) {
    if (e.keyCode == 32 && $(e.target).hasClass('tty')) {
      e.preventDefault();
    }
  };
}

document.onload = init();
