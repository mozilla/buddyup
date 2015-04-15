#!/bin/bash
pushd gaia
TEST_FILES='./apps/buddyup/test/marionette/*_test.js' make test-integration-test
popd
