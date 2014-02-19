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
    
    var url = 'http://placekitten.com/g/200/300'; //?q=' + Math.random();
    var request = new XMLHttpRequest();
    
    request.open('get', url, true);
    request.responseType = 'blob';

    request.onerror = function(e) {
      statusMsg.innerHTML = request.statusText;
    };

    request.onload = function() {

      var blob = request.response;
      var url = URL.createObjectURL(blob);
      var img = document.createElement('img');
      img.src = url;
      loadedImage.appendChild(img);

    };



    request.send();

  }

};
