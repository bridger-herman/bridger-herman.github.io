import { partial } from './tools.js'
IS_TTY_KEY = /[A-Za-z0-9 ~!@#$%^&*\(\)_+=\-`,./;'\[\]\\<>?:"\{\}\|"'`]/;

PAGE_NAMES = [
  'about',
  'projects',
  'research',
  'photography',
];

ACCEPTED_COMMANDS = {
  'ls': lsCommand,
  'cd': cdCommand,
  'help': helpCommand,
  '': helpCommand,
};

export function setupTTY() {
  let ttys = $('.tty');
  ttyObjs = [];
  ttys.each(function (i) {
    ttyObjs.push(new TTYObject(ttys[i]));
  });
  constructTTY(ttys, window.location.hash);
  return ttyObjs;
}

// Dummy expression evaluator for now - might try and use a Rust-based
// WebAssembly bash emulator
function parseExpr(expr) {
  let splitExpr = expr.split('&nbsp;');
  let command = splitExpr[0];
  let args = splitExpr.slice(1);
  return [command, args];
}
function evalExpr(expr) {
  let [command, args] = parseExpr(expr);
  let commandFn = ACCEPTED_COMMANDS[command];
  if (commandFn) {
    let [output, exitStatus] = ACCEPTED_COMMANDS[command](args);
    if (exitStatus == 0) {
      expandTTY(output);
    }
  }
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
      let exprString = '';
      $(charList).children('.char').each((index, charElem) => {
        exprString += charElem.innerHTML;
      });
      evalExpr(exprString);
      charList.empty();
      charList.append(getCursor());
    }
    else if (key === 'Escape') {
      $('.tty>pre').removeClass('expanded');
    }
    else if (key === 'Tab') {
      event.preventDefault();
      // Hacked together to support cd only right now
      let exprString = '';
      $(charList).children('.char').each((index, charElem) => {
        exprString += charElem.innerHTML;
      });
      let [command, args] = parseExpr(exprString);
      if (command === 'cd') {
        for (let i in PAGE_NAMES) {
          if (PAGE_NAMES[i].startsWith(args[0])) {
            let secondHalf = sliceExpr(exprString, 'cd&nbsp;' + PAGE_NAMES[i]);
            for (let i in secondHalf) {
              self.maxIndex++;
              self.currentIndex++;
              $(charList).find($('.empty')).before($('<div/>', {class: 'char', text: secondHalf[i]}))
            }
          }
        }
      }
    }
    else {
      console.log(key);
    }
    $(charList).find(':nth-child(' + (self.currentIndex) + ')').addClass('cursor');
  };
  $(this.tty).on('keydown', partial(this.processKeyStroke, this));
}

function getCursor(classes='cursor empty') {
  return $('<div/>', {class: classes, text: '\xa0'});
}

function getShellLine(currentLocation='/build/about.html') {
  let parts = currentLocation.split('/');
  if (parts[2]) {
    let dot = parts[2].indexOf('.');
    return '/bridger-herman.github.io/' + parts[2].slice(0, dot);
  } else {
    return '/bridger-herman.github.io'
  }
}

function constructTTY(el, currentLocation) {
  // Construct the input line
  $(el).append($('<div/>', {
    class: 'tty-input',
  }).append($('<div/>', {
    class: 'shell-line',
    text: getShellLine(currentLocation),
  })).append($('<div/>', {
    class: 'shell-branch',
    text: '\xa0' // Non-breaking space
  })).append($('<ul/>', {
    class: 'char-list',
  }).append(getCursor())))
  .append($('<pre/>'));
}

function expandTTY(output) {
  $('.tty>pre').addClass('expanded');
  $('.tty>pre').html(output);
}

// Return the text of the second half of the whole expression (inferred from
// tab-complete)
function sliceExpr(userExpr, wholeExpr) {
  let matchIndex = 0;
  for (let i = 0; i < wholeExpr.length; i++) {
    if (userExpr[i] === wholeExpr[i]) {
      matchIndex++;
    }
  }
  return wholeExpr.slice(matchIndex);
}

// Dummy commands
function lsCommand(args) {
  return [PAGE_NAMES.join('\n'), 0];
}

function cdCommand(args) {
  if (PAGE_NAMES.indexOf(args[0]) < 0) {
    return ['', -1];
  }
  let prefix = '/build/';
  let suffix = '.html';
  window.location.pathname = prefix + args[0] + suffix;
  return ['', 0];
}

function helpCommand(args) {
  let helpText =
    '** Elementary Terminal Emulator **\n\n' +
    'Available terminal commands:\n' +
    '  ls   : list pages on website\n' +
    '  cd   : navigate to a page\n' +
    '  help : print this help message\n\n' +
    'Press `Esc` to close terminal window';
  return [helpText, 0];
}
