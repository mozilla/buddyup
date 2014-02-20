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
      term = 'cat';
    }

    var url = 'http://en.wiktionary.org/w/api.php?action=query&prop=extracts&exchars=1000&format=json&exsectionformat=plain&titles=' + term;

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
        // The way we get to the actual definition text is a little convoluted due to the way results are formatted
        var response = JSON.parse(request.responseText);
        var text = response.query.pages;
        var textKeys = Object.keys(text);
        text = text[textKeys[0]].extract;
        definitionText.innerHTML = text;
      } catch(e) {
        statusMsg.innerHTML = 'Error loading definition';
        console.log('BOOM', e);
      }

    };


    request.send();

  }

};
