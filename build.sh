#!/bin/bash

set -e

printBoxedMessage()
{
  echo
  echo "--------------------"
  echo $1
  echo "--------------------"
}

printBoxedMessage "Print Build Environment"
echo "***** Node Version:"
node -v
echo "***** npm version:"
npm -v

###
# Install Dependencies
###
printBoxedMessage "Install"
npm install

###
# Run package building
###
printBoxedMessage "Build"
npm run build

###
# Run unit & linting tests
###
printBoxedMessage "Test"
npm test

###
# Run prune
###
printBoxedMessage "Prune"
npm prune --production

###
# Run dedupe
###
printBoxedMessage "Dedupe"

# if dedupe fails, it is probably due to this: https://github.com/npm/npm/issues/20173
# to remedy: check in package-lock.json and remove the "|| printBoxedMessage ..."
npm dedupe # || printBoxedMessage "WARNING: dedupe failed, ignoring for now"
