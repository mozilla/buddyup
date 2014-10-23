// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

    // We'll ask the browser to use strict code to help us catch errors earlier.
    // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
    'use strict';

    // this will be read from device config maybe?
    var API_V1 = 'https://support.allizom.org/api/1/';
    var API_V2 = 'https://support.allizom.org/api/2/';
    var PRODUCT = 'firefox-os';
    var LOCALE = 'en-US';

    var questions = '';
    var myQuestions = document.querySelector('#myquestions');

    nunjucks.configure({ autoescape: true });

    function buildURL() {
        var base = API_V2 + 'question/?format=json';
        return base + '&product=' + PRODUCT + '&locale=' + LOCALE;
    }

    // only attempt to load questions if we have a container.
    if(myQuestions) {
        var request = new XMLHttpRequest();

        request.open('GET', buildURL());
        request.onload = function() {
            var results;
            var showAll = false;
            var json = JSON.parse(this.responseText);

            if (myQuestions.dataset['all']) {
                results = json.results;
                showAll = true;
            } else {
                results = json.results.slice(0, 3);
            }

            var html = nunjucks.render('questions.html', { results: results, all: showAll });
            myQuestions.innerHTML = html;
        }
        request.send();
    }
});
