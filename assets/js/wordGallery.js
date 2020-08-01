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
    }, 5000);
  });
}

function animateTransition(elementToChange, word) {
  // Delete the old word
  let deleteInterval = setInterval(() => {
    let oldHtml = $(elementToChange).html();
    if (oldHtml.length > 0) {
      $(elementToChange).html(oldHtml.slice(0, oldHtml.length - 1));
    } else {
      clearInterval(deleteInterval);

      // Type the new word
      var letterIndex = 0;
      let intervalId = setInterval(() => {
        let oldHtml = $(elementToChange).html();
        if (letterIndex < word.length) {
          $(elementToChange).html(oldHtml + word[letterIndex++])
        } else {
          clearInterval(intervalId);
        }
      }, 60);
        }
  }, 40);
}
