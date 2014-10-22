// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

    // We'll ask the browser to use strict code to help us catch errors earlier.
    // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
    'use strict';

    // this will be read from device config maybe?
    var PRODUCT = 'firefox-os';
    var LOCALE = 'en-US';

    var questions = '';
    var myQuestions = document.querySelector('#myquestions');

    function buildURL() {
        var base = 'https://support.allizom.org/api/2/question/?format=json';
        return base + '&product=' + PRODUCT + '&locale=' + LOCALE;
    }

    // only attempt to load questions if we have a container.
    if(myQuestions) {
        var request = new XMLHttpRequest();

        request.open('GET', buildURL());
        request.onload = function() {
            var json = JSON.parse(this.responseText);
            var results = json.results;
            var resultCount = myQuestions.dataset['all'] ? results.length : 3;

            for (var i = 0; i < resultCount; i++) {
                questions += '<li><a href="">' + results[i].title + '</a></li>';
            }
            myQuestions.innerHTML = questions;
        }

        request.send();
    }

});
