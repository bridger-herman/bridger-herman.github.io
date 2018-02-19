IS_TTY_KEY = /[A-Za-z0-9 ~!@#$%^&*\(\)_+=\-`,./;'\[\]\\<>?:"\{\}\|"'`]/;


function setupTTY() {
  let ttys = $('.tty');
  ttyObjs = [];
  ttys.each(function (i) {
    ttyObjs.push(new TTYObject(ttys[i]));
  });
  $(ttys).html(getPrompt(window.location.hash));
  return ttyObjs;
}

function evalExpr(expr) {

}

function TTYObject(tty) {
  this.currentIndex = 1;
  this.minIndex = 1;
  this.maxIndex = 1;
  this.tty = tty;
  // Parially apply this to get actual self (not div object)
  this.processKeyStroke = function(self, event) {
    let key = event.key;
    let target = $(event.target);
    let charList = $(target).find('.char-list');
    $(charList).find('.cursor').removeClass('cursor');
    if (IS_TTY_KEY.test(key) && key.length === 1) {
      key = key.replace(' ', '&nbsp;'); // Hacky way to do this...
      $(charList).insertAt(self.currentIndex - 1, '<div class="char">' + (key) + '</div>');
      self.currentIndex++;
      self.maxIndex++;
    }
    else if (key.startsWith('Arrow')) {
      switch (key.slice(5)) {
        case 'Left':
          if (self.currentIndex > self.minIndex) {
            self.currentIndex--;
          }
          break;
        case 'Right':
          if (self.currentIndex < self.maxIndex) {
            self.currentIndex++;
          }
          break;
        default:
          break;
      }
    }
    else if (key === 'Backspace') {
      $(charList).find(':nth-child(' + (self.currentIndex - 1) + ')').remove();
      if (self.currentIndex > self.minIndex) {
        self.maxIndex--;
        self.currentIndex--;
      }
    }
    else if (key === 'Enter') {
      self.currentIndex = 1;
      self.minIndex = 1;
      self.maxIndex = 1;
      charList.empty();
      charList.append(getCursor());
    }
    else {
      console.log(key);
    }
    $(charList).find(':nth-child(' + (self.currentIndex) + ')').addClass('cursor');
  };
  $(this.tty).on('keydown', partial(this.processKeyStroke, this));
}

function getCursor(classes='cursor empty') {
  return '<div class="' + classes + '">&nbsp;</div>'
}

function getShellLine(currentLocation='#about') {
  return '/bridger-herman.github.io/' + currentLocation;
}

function getPrompt(currentLocation='#about', currentBranch='&nbsp;') {
  let locationPrompt = '<div class="shell-line">' + getShellLine(currentLocation) + '</div>';
  let branch = '<div class="shell-branch">' + currentBranch + '</div>';
  return locationPrompt + branch + '<ul class="char-list">' + getCursor() + '</ul>';
}
