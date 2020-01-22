# opxhub-ui

This is a repository for the application: opxhub-ui

App URL: https://opxhub-ui.us-west-2.test.expedia.com/

Kumo: https://console.kumo.expedia.biz/apps/opxhub-ui

Splunk Log Dashboard: https://splunkewe.us-west-2.test.monitoring.expedia.com/en-US/app/search/opxhubui

## Development

1. To start developing locally, clone the project:

   ```bash
   git clone git@github.expedia.biz:EGPlatform/opxhub-ui.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

   in case of issues with `npm install` you may need to uncomment the `.npmrc` file or simply run:

   ```bash
   npm config set registry https://npm.homeawaycorp.com/artifactory/api/npm/npm
   ```

3. Run the script build to generate the buildInfo.js

   ```bash
   npm build
   ```

4. Run the application

   ```bash
   npm start
   ```

5. Navigate to `localhost:8080`
