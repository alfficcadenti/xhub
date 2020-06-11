#!/bin/bash

# For NPM versions < 6.1.0, change the first line to:
# npx @homeaway/create-catalyst-eg \

npm init @homeaway/catalyst-eg \
    --appName="opxhub-ui" \
    --sourceRepo="https://github.expedia.biz/eg-reo-opex/opxhub-ui" \
    --team="Operational Excellence" \
    --user="aficcadenti" \
    --roleName="opxhub-ui" \
    --mail="vrbo_opex@expedia.com" \
    --initLocalGitRepo=false \
    --commitGeneratedCode=true \
    --force
