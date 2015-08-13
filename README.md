buddyup-ui
==========

The UI repo for the buddy-up realtime support FirefoxOS app

# Development Workflow

First, let's install the required dependencies. From the command line, run:

```bash
npm install
# https://github.com/gruntjs/grunt-cli#grunt-cli-
npm install -g grunt-cli
```

Once the above completes, run:

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
## Unit
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

## Integration
You need to follow the same procedure as for unit tests.
```bash
./scripts/fetch-gaia.sh
./scripts/run-integration-tests-server.sh
```

And in another shell,
```bash
./scripts/run-integration-tests.sh
```

# Localization
Localizations are not included by default, but are pulled from Verbatim,
via Sumo. To download the translations, run

```bash
grunt get_localization
```

If all goes well, you should have one js file in `app/translations/` for
each supported locale. For example, the French localizations would be
stored in `app/translations/fr.js`.
