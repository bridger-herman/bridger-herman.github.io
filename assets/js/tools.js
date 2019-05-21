// Source: http://benalman.com/news/2012/09/partial-application-in-javascript/#partial-application
export function partial(fn /*, args...*/) {
  // A reference to the Array#slice method.
  var slice = Array.prototype.slice;
  // Convert arguments object to an array, removing the first argument.
  var args = slice.call(arguments, 1);
  return function() {
    // Invoke the originally-specified function, passing in all originally-
    // specified arguments, followed by any just-specified arguments.
    return fn.apply(this, args.concat(slice.call(arguments, 0)));
  };
}

// Source: Benjamin Gudehus
// https://stackoverflow.com/questions/3562493/jquery-insert-div-as-certain-index
// jQuery.fn.insertAt = function(index, element) {
//   var lastIndex = this.children().size();
//   if (index < 0) {
//     index = Math.max(0, lastIndex + 1 + index);
//   }
//   this.append(element);
//   if (index < lastIndex) {
//     this.children().eq(index).before(this.children().last());
//   }
//   return this;
// }

// Source: Andy Gaskell
// https://stackoverflow.com/questions/3562493/jquery-insert-div-as-certain-index
function insertAtIndex(i, char) {
    if (i === 0) {
     $(".char-list").prepend("<div>okay things</div>");
     return;
    }
    $(".char-list > div:nth-child(" + (i) + ")").after("<div>great things</div>");
}

jQuery.fn.insertAt = function(index, element) {
  if (index === 0) {
    this.prepend(element);
  }
  else {
    this.find(':nth-child(' + (index) + ')').after(element);
  }
  return this;
}
