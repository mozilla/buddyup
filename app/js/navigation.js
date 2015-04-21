'use strict';

/* global _, LaunchChecks, Utils */

(function(exports) {
  var current_iframe;

  function iframe_clicked(evt) {
    var elem = evt.target;
    while (elem) {
      if (elem.href || elem.dataset.action) {
        break;
      }
      elem = elem.parentElement;
    }
    if (!elem || elem.getAttribute('role')) {
      return;
    }

    if (elem.dataset.action) {
      close_iframe(elem.dataset.action);
    } else if (elem.href) {
      open_link(elem.href, {modal: elem.dataset.modal});
    }
    evt.preventDefault();
  }

  function animate(element, animation_class) {
    element.classList.add(animation_class);
    var defer = Utils.defer();
    element.addEventListener('animationend', function animation_end() {
      element.removeEventListener('animationend', animation_end);
      defer.resolve();
    });

    defer.promise.then(function() {
      setTimeout(function() {
        element.classList.remove(animation_class);
      });
    });

    return defer.promise;
  }

  function open_link(url, options) {
    var defaults = {
      should_animate: true,
      modal: false
    };
    options = _.assign(defaults, options);

    var new_iframe = document.createElement('iframe');
    new_iframe.src = url;

    document.body.appendChild(new_iframe);
    new_iframe.contentWindow.addEventListener('click', iframe_clicked);

    if (options.should_animate) {
      current_iframe.classList.add('animation-paused');
      new_iframe.classList.add('animation-paused');
      if (options.modal) {
        animate(new_iframe, 'modal-inbound');
      } else {
        animate(current_iframe, 'push-outbound');
        animate(new_iframe, 'push-inbound');
      }
    } else {
      current_iframe = new_iframe;
    }

    new_iframe.addEventListener('load', function loaaaaad() {
      new_iframe.removeEventListener('load', loaaaaad);
      new_iframe.classList.remove('animation-paused');
      current_iframe.classList.remove('animation-paused');

      current_iframe = new_iframe;
    });
  }

  function reload_if_necessary(new_iframe) {
    var refresh_mode = new_iframe.contentDocument.documentElement // <html>
      .dataset.refreshMode;

    if (refresh_mode == 'manual') {
      return Promise.resolve();
    }

    var defer = Utils.defer();
    new_iframe.contentWindow.location.reload();
    new_iframe.addEventListener('load', function newFrameLoad() {
      new_iframe.removeEventListener('load', newFrameLoad);
      new_iframe.contentWindow.addEventListener('click', iframe_clicked);
      defer.resolve();
    });
    return defer.promise;
  }

  function close_iframe(action) {
    if (action !== 'back' && action !== 'close') {
      return;
    }

    var new_iframe = current_iframe.previousElementSibling;

    reload_if_necessary(new_iframe).then(function() {
      var animation_promise;
      if (action == 'close') {
        animation_promise = animate(current_iframe, 'modal-outbound');
      } else {
        animate(new_iframe, 'pop-inbound');
        animation_promise = animate(current_iframe, 'pop-outbound');
      }
      return animation_promise;
    }).then(function() {
      document.body.removeChild(current_iframe);
      current_iframe = new_iframe;
    });
  }

  var Navigation = {
    init: function() {
      open_link('home.html', {should_animate: false});
      LaunchChecks.init();
    },

    go_to_view: function(url) {
      var iframes = [].slice.call(document.querySelectorAll('iframe'));
      current_iframe = iframes.shift();
      iframes.forEach(function(iframe) {
        document.body.removeChild(iframe);
      });
      open_link(url, {should_animate: false});
    },

    close_current_view: function() {
      close_iframe('close');
    },

    everyone_should_refresh: function() {
      var iframes = [].slice.call(document.querySelectorAll('iframe'));
      iframes.forEach(function(iframe) {
        delete iframe.contentDocument.documentElement.dataset.refreshMode;
      });
    },

    get current_view() {
      return current_iframe.contentWindow;
    }
  };

  exports.Navigation = Navigation;
  Navigation.init();
})(window);
