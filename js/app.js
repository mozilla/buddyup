window.onload = function() {

  var apiURL = 'https://developer.mozilla.org/search.json?q=';
  var defaultSearchTerm = 'javascript';
  var errorMsg = document.getElementById('error');
  var searchInput = document.getElementById('term');
  var searchButton = document.getElementById('search');
  var results = document.getElementById('results');
  var request = null;
  var translate = document.webL10n.get;
  var form = document.querySelector('form');

  // Forms will take the values in the input fields their contain
  // and send them to a server for further processing,
  // but since we want to stay in this page AND make a request to another server,
  // we will listen to the 'submit' event, and prevent the form from doing what
  // it would usually do, using preventDefault.
  // Read more about it here:
  // https://developer.mozilla.org/Web/API/event.preventDefault
  //
  // Then we search without leaving this page, just as we wanted.
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      search();
  }, false);

  // We'll wait until the localisations library has loaded all the strings.
  // It will let us know by dispatching the 'localized' event.
  window.addEventListener('localized', function() {
    // Then we'll initiate a search
    search();
  }, false);

  // ---

  function search() {
    
    // Are we searching already? Then stop that search
    if(request && request.abort) {
      request.abort();
    }


    results.textContent = translate('searching');

    // We will be using the 'hidden' attribute throughout the app rather than a
    // 'hidden' CSS class because it enhances accessibility.
    // See: http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#the-hidden-attribute
    errorMsg.hidden = true;


    var term = searchInput.value;
    if(term.length === 0) {
      term = defaultSearchTerm;
    }

    var url = apiURL + term;

    // If you don't set the mozSystem option, you'll get CORS errors (Cross Origin Resource Sharing)
    // You can read more about CORS here: https://developer.mozilla.org/docs/HTTP/Access_control_CORS
    request = new XMLHttpRequest({ mozSystem: true });

    request.open('get', url, true);
    request.responseType = 'json';

    request.onerror = function(e) {
      var errorMessage = request.error;
      if(!errorMessage) {
        errorMessage = translate('searching_error');
      }
      showError(errorMessage);
    };

    request.onload = function() {

      results.textContent = '';
      results.hidden = false;
      
      var response = request.response;
      var documents;
      
      if(response !== null) {
        documents = response.documents;
      }
      
      if(response !== null && documents.length) {

        documents.forEach(function(doc) {

          var h2 = document.createElement('h2');
          var docLink = document.createElement('a');

          docLink.textContent = doc.title;
          docLink.href = doc.url;

          // We want the links to open in a pop up window with a 'close'
          // button, so that the user can consult the result and then close it and
          // be brought back to our app.
          // If we did nothing, these external links would take over the entirety
          // our app and there would be no way for a user to go back to the app.
          // But Firefox OS allows us to open ONE new window per app; these new
          // windows will have a close button, so the user can close the overlay
          // when they're happy with what they've read.
          // Therefore we will capture click events on links, stop them from
          // doing their usual thing using preventDefault(),
          // and then open the link but in a new window.
          docLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.href, 'overlay');
          }, false);

          h2.appendChild(docLink);
          results.appendChild(h2);

        });

      } else {

        var p = document.createElement('p');
        p.textContent = translate('search_no_results');
        results.appendChild(p);

      }

    };

    request.send();

  }


  function showError(text) {
    errorMsg.textContent = text;
    errorMsg.hidden = false;
    results.hidden = true;
  }

};
