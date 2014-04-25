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


    results.textContent = translate('searching');
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
        errorMessage = 'Error while searching'; // TODO translate
      }
      showError(errorMessage);
    };

    request.onload = function() {

      results.textContent = '';
      results.classList.remove('hidden');
      
      var response = request.response;
      var documents;
      
      if(response !== null) {
        documents = response.documents;
      }
      
      if(response !== null && documents.length) {
        
        documents.forEach(function(doc) {
          
          var h2 = document.createElement('h2');
          h2.textContent = doc.title;
          
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
    errorMsg.classList.remove('hidden');
    results.classList.add('hidden');
  }

};
