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
    if (IS_TTY_KEY.test(key) && key.length === 1) {
      key = key.replace(' ', '&nbsp;'); // Hacky way to do this...
      $(target).find('.cursor').remove();
      $(target).append('<div class="char">' + key + '</div>');
      $(target).append(getCursor());
      self.currentIndex++;
    }
    else if (key.startsWith('Arrow')) {
      switch (key.slice(5)) {
        case 'Left':
          self.currentIndex--;
          $(target).find('.cursor').remove();
          let thing = $(target + ':nth-child(' + self.currentIndex + ')')
          console.log(thing);
          break;
        case 'Right':
          break;
        default:
          console.log('defaulting');
      }
    }
    else {
      console.log(key);
    }
  };
  $(this.tty).on('keydown', partial(this.processKeyStroke, this));
}

function getCursor() {
  return '<div class="cursor">&nbsp;</div>'
}

function getPrompt(currentLocation='#about', currentBranch='master') {
  let locationPrompt = '<div class="shell-line">/bridger-herman.github.io/' + currentLocation + '</div>';
  let branch = '<div class="shell-branch">' + currentBranch + '</div>';
  return locationPrompt + branch + getCursor();
}
