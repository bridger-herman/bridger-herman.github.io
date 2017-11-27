IS_TTY_KEY = /[A-Za-z0-9 ~!@#$%^&*\(\)_+=-`,./;'\[\]\\<>?:"\{\}\|"'`]/;


function setupTTY() {
  let ttys = $('.tty');
  ttyObjs = [];
  ttys.each(function (i) {
    ttyObjs.push(TTYObject(ttys[i]));
  });
  $(ttys).html(getPrompt());
}

function TTYObject(tty) {
  this.currentIndex = 0;
  this.tty = tty;
  $(this.tty).on('keydown', this.processKeyStroke);
  // $(this.tty).keypress(this.processKeyStroke);
  this.processKeyStroke = function(event) {
    let key = event.key;
    let target = $(event.target);
    if (IS_TTY_KEY.test(key) && key.length === 1) {
      console.log(key);
      // let child = ;
      $(target).append('<div class="char">' + key + '</div>');
      let text = $(target[target.length - 1]).html();
      console.log(text);
      this.currentIndex++;
    }
    else {
      console.log(key);
    }
  }
}


function getPrompt(currentLocation='/bridger-herman.github.io/#about', currentBranch='master') {
  let locationPrompt = '<div class="shell-line">' + currentLocation + '</div>';
  let branch = '<div class="shell-branch">' + currentBranch + '</div>';
  return locationPrompt + branch;
}
