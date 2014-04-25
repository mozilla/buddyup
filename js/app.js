window.onload = function() {

  var apiURL = 'https://developer.mozilla.org/search.json?q=';
  var defaultSearchTerm = 'javascript';
  var errorMsg = document.getElementById('error');
  var searchInput = document.getElementById('term');
  var searchButton = document.getElementById('search');
  var definitionText = document.getElementById('definitionText');
  var request = null;
  var translate = document.webL10n.get;

  var form = document.querySelector('form');
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      search();
  }, false);

  search();

  // ---

  function search() {

    // Are we searching already? Then stop that search
    if(request && request.abort) {
      request.abort();
    }


    definitionText.innerHTML = '<p>' + translate('searching') + '</p>';
    errorMsg.classList.add('hidden');


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
        errorMessage = 'Error while searching';
      }
      showError(errorMessage);
    };

    request.onload = function() {

      definitionText.classList.remove('hidden');
      
      var response = request.response;
      var documents = response.documents;
      
      if(documents.length) {
        var doc = response.documents[0];
        var text = doc.excerpt;
        var title = doc.title;

        definitionText.innerHTML = '<h2>' + title + '</h2>' + text;
      } else {
        definitionText.innerHTML = '<p>' + translate('search_no_results') + '</p>';
      }

    };

    request.send();

  }


  function showError(text) {
    errorMsg.innerHTML = text;
    errorMsg.classList.remove('hidden');
    definitionText.classList.add('hidden');
  }

};
