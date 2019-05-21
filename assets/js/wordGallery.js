export function initWordGalleries() {
  $('.word-gallery').each((index, element) => {
    var words = JSON.parse($(element).html().replace('\n', ''));
    var previousIndex = 0;
    $(element).html(words[0]);
    setInterval(() => {
      let wordIndex = previousIndex;
      while (wordIndex == previousIndex) {
        wordIndex = Math.floor(Math.random() * words.length);
      }
      previousIndex = wordIndex;
      animateTransition(element, words[wordIndex]);
    }, 4000);
  });
}

function animateTransition(elementToChange, word) {
  var letterIndex = 0;
  $(elementToChange).html('');
  let intervalId = setInterval(() => {
    let oldHtml = $(elementToChange).html();
    if (letterIndex < word.length) {
      $(elementToChange).html(oldHtml + word[letterIndex++])
    } else {
      clearInterval(intervalId);
    }
  }, 60);
}
