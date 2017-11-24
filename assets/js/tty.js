function setupTTY() {
  let ttys = $('.tty');
  $(ttys).html(getPrompt());
}

function processKeyStroke(event) {

}

function getPrompt(currentLocation='/bridger-herman.github.io/#about', currentBranch='master') {
  let locationPrompt = '<div class="shell-line">' + currentLocation + '</div>';
  let branch = '<div class="shell-branch">' + currentBranch + '</div>';
  return locationPrompt + branch;
}
