'use strict';

/* global require, marionette, setup, test */

var BuddyUp = require('./lib/buddyup');
var assert = require('assert');

marionette('Home view', function() {

  var app;
  var homeView;
  var client = marionette.client();

  setup(function(done) {
    app = new BuddyUp(client);
    app.launch().then(function(home) {
      homeView = home;
      done();
    });
  });

  test('should open the "ask a question" panel', function() {
    return homeView.openAskQuestion().then(function(questionView) {
      assert.equal(questionView.pageTitle, 'My Question');
    });
  });
});
