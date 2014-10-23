buddyup-ui
==========

The UI repo for the buddy-up realtime support FirefoxOS app

# Development Workflow

Inside the buddyup root directory run:

```bash
grunt
```

This will precompile the nunjucks templates, start up the server, and start watching
for changes to either app.js or any of the templates in app/views/. If any of the templates
changes, it will auto-reload them.

To access the app via a browser:

```bash
http://127.0.0.1:8000/app/index.html
```

To test on an real device, use the WebIDE built into Firefox (https://developer.mozilla.org/en-US/docs/Tools/WebIDE)
NOTE: You still need to run grunt prior to launching the WebIDE.

# Tests
To run unit tests, we use the Gaia infrastructure.

You need to fetch gaia and run the test server
```bash
./scripts/fetch-gaia.sh
./scripts/run-unit-test-server.sh
```

And in another shell,
```bash
./scripts/run-unit-tests.sh
```
