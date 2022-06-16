#!/bin/sh
set -x
pwd
NODE_ENV=production node ./build/server/index.js > logs/opxhub-ui.log