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

    var request = new XMLHttpRequest();

    function buildURL() {
        var base = 'https://support.allizom.org/api/2/question/?format=json';
        return base + '&product=' + PRODUCT + '&locale=' + LOCALE;
    }

    request.open('GET', buildURL());
    request.onload = function() {
        var json = JSON.parse(this.responseText);
        var results = json.results;

        for (var i = 0; i < 3; i++) {
            questions += '<li><a href="">' + results[i].title + '</a></li>';
        }
        myQuestions.innerHTML = questions;
    }

    request.send();

});
