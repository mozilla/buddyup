window.onload = function() {

  var statusMsg = document.getElementById('status');
  var searchInput = document.getElementById('term');
  var searchButton = document.getElementById('search');
  var definitionText = document.getElementById('definitionText');

  statusMsg.innerHTML = 'Ready';

  searchButton.addEventListener('click', search, false);

  search();

  // ---

  function search() {
    
    var term = searchInput.value;

    if(term.length === 0) {
      term = 'javascript';
    }

    var url = 'https://developer.mozilla.org/en-US/search.json?q=' + term;
    
    definitionText.innerHTML = '<p>Searching...</p>';

    // If you don't set the mozSystem option, you'll get CORS errors (Cross Origin Resource Sharing)
    // You can read more about CORS here: https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS
    var request = new XMLHttpRequest({ mozSystem: true });

    request.open('get', url, true);
    request.responseType = 'application/json';

    request.onerror = function(e) {
      statusMsg.innerHTML = request.statusText;
    };

    request.onload = function() {

      try {

        var response = JSON.parse(request.responseText);
        var doc = response.documents[0];
        var text = doc.excerpt;
        var title = doc.title;

        definitionText.innerHTML = '<h2>' + title + '</h2>' + text;
        definitionText.classList.remove('hidden');

      } catch(e) {

        statusMsg.innerHTML = 'Error loading definition';
        console.log('BOOM', e);

      }

    };


    request.send();

  }

};
