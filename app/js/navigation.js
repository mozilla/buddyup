'use strict';

(function(exports) {
  var current_iframe;

  function init() {
    open_link('home.html');
  }

  function iframe_clicked(evt) {
    var elem = evt.target;
    while (elem) {
      if (elem.href || elem.dataset.action) {
        break;
      }
      elem = elem.parentElement;
    }
    if (!elem || elem.getAttribute('role') === 'tab') {
      return;
    }

    if (elem.dataset.action) {
      close_iframe(elem.dataset.action);
    } else if (elem.href) {
      open_link(elem.href);
    }
    evt.preventDefault();
  }

  function open_link(url) {
    var new_iframe = document.createElement('iframe');
    new_iframe.src = url;
    document.body.appendChild(new_iframe);
    new_iframe.contentWindow.addEventListener('click', iframe_clicked);
    current_iframe = new_iframe;
  }

  function close_iframe(action) {
    if (action !== 'back') {
      return;
    }

    var new_iframe = current_iframe.previousElementSibling;
    document.body.removeChild(current_iframe);
    current_iframe = new_iframe;
  }

  init();

  var Navigation = {
    go_to_view: function(url) {
      var iframes = [].slice.call(document.querySelectorAll('iframe'));
      current_iframe = iframes.shift();
      iframes.forEach(function(iframe) {
        document.body.removeChild(iframe);
      });
      open_link(url);
    }
  };

  exports.Navigation = Navigation;
})(window);
