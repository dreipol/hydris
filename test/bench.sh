#!/usr/bin/env bash

TEST_FILE=file://`pwd`/test/fixtures/index.html

npm run demo | artillery run ./test/stress-test.yml --overrides '{ "config": { "variables": { "url": "'$TEST_FILE'" }}}'
