IS_TTY_KEY = /[A-Za-z0-9 ~!@#$%^&*\(\)_+=-`,./;'\[\]\\<>?:"\{\}\|"'`]/;


function setupTTY() {
  let ttys = $('.tty');
  ttyObjs = [];
  ttys.each(function (i) {
    ttyObjs.push(new TTYObject(ttys[i]));
  });
  $(ttys).html(getPrompt());
}

function TTYObject(tty) {
  this.currentIndex = 0;
  this.tty = tty;
  // Parially apply this to get actual self (not div object)
  this.processKeyStroke = function(self, event) {
    let key = event.key;
    let target = $(event.target);
    let charList = $(target).find('.char-list');
    if (IS_TTY_KEY.test(key) && key.length === 1) {
      key = key.replace(' ', '&nbsp;'); // Hacky way to do this...
      $(charList).find('.cursor').remove();
      $(charList).append('<div class="char">' + key + '</div>');
      $(charList).append(getCursor());
      self.currentIndex++;
    }
    else if (key.startsWith('Arrow')) {
      $(charList).find('.cursor').removeClass('cursor');
      let currentChar = $(charList).find(':nth-child(' + self.currentIndex + ')');
      switch (key.slice(5)) {
        case 'Left':
          self.currentIndex--;
          break;
        case 'Right':
          break;
        default:
          console.log('defaulting');
      }
      currentChar.addClass('cursor')
    }
    else {
      console.log(key);
    }
  };
  $(this.tty).on('keydown', partial(this.processKeyStroke, this));
}

function getCursor() {
  return '<div class="cursor empty">&nbsp;</div>'
}

function getPrompt(currentLocation='#about', currentBranch='master') {
  let locationPrompt = '<div class="shell-line">/bridger-herman.github.io/' + currentLocation + '</div>';
  let branch = '<div class="shell-branch">' + currentBranch + '</div>';
  return locationPrompt + branch + '<ul class="char-list">' + getCursor() + '</ul>';
}
