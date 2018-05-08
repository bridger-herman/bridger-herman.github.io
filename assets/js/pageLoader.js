GH_URL = 'https://raw.githubusercontent.com/bridger-herman/bridger-herman.github.io/master/'

// Load all pages, HTML file corresponds to div ID
function loadPages() {
  let pageDivs = $('.page');
  pageDivs.each(function(i) {
    if ($(pageDivs[i]).hasClass('inline')) {
      return;
    }
    let htmlName = './' + $(pageDivs[i]).attr('id') + '.html';
    var xhr= new XMLHttpRequest();
    xhr.open('GET', GH_URL + htmlName, true);
    xhr.onreadystatechange= function() {
      if (this.readyState!==4) return;
      if (this.status!==200) return;
      $(pageDivs[i]).html(this.responseText);
    };
    xhr.send();
  });
}

// Load a page, by div ID
function loadPage(name) {
  if ($(name).hasClass('inline')) {
    return;
  }
  let htmlName = './' + $(name).attr('id') + '.html';
  var xhr= new XMLHttpRequest();
  xhr.open('GET', GH_URL + htmlName, true);
  xhr.onreadystatechange= function() {
    if (this.readyState!==4) return;
    if (this.status!==200) return;
    $(name).html(this.responseText);
  };
  xhr.send();
}
