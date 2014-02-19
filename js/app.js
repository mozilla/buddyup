// check the console.log bug
// update + debug workflow broken - breakpoints are lost
window.onload = function() {

  var statusMsg = document.getElementById('status');
  var loadedImage = document.getElementById('loadedImage');
  var loadImageButton = document.getElementById('loadImage');

  statusMsg.innerHTML = 'Ready';

  loadImageButton.addEventListener('click', doAjax, false);

  doAjax();

  // ---

  function doAjax() {
    
    var url = 'http://placekitten.com/g/200/300/?q=' + Math.random();
    // If you don't set the mozSystem option, you'll get CORS errors (Cross Origin Resource Sharing)
    // You can read more about CORS here: https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS
    var request = new XMLHttpRequest({ mozSystem: true });

    request.open('get', url, true);
    request.responseType = 'blob';

    request.onerror = function(e) {
      statusMsg.innerHTML = request.statusText;
    };

    request.onload = function() {

      var blob = request.response;
      var url = URL.createObjectURL(blob);
      loadedImage.src = url;

    };



    request.send();

  }

};
