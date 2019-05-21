import { importWasm } from './loadWasm.js';
import { setupTTY, getShellLine } from './tty.js';
import { initWordGalleries } from './wordGallery.js';

function init() {
  // Set up header items
  let ttyObjs = setupTTY();

  // Set up navigation
  $('nav ul li a[href="' + window.location.pathname + '"]').parent().addClass('active');
  $(ttyObjs).each(function(i) {
    $(ttyObjs[i].tty).find('.shell-line').html(getShellLine(window.location.pathname));
    ttyObjs[i].tty.focus(true);
  });

  // Set up word gallery
  initWordGalleries();

  // https://stackoverflow.com/a/18525368
  window.onkeydown = function(e) {
    if (e.keyCode == 32 && $(e.target).hasClass('tty')) {
      e.preventDefault();
    }
  };
}

window.onload = () => importWasm().then(init);
