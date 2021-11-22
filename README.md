# OpXHub-UI

A [Catalyst](https://pages.github.expedia.biz/Catalyst/information/guide/introduction) web application that retrieves, organizes, and presents operational metrics across brands. OpXhub-UI is a [React](https://reactjs.org/) web application that runs on [Hapijs](https://hapi.dev/tutorials), an enterprise-grade [node](https://nodejs.org/) server system. [Recharts](https://recharts.org/) is the primary library used for its data visualizations.

See our official documentation [here](https://pages.github.expedia.biz/eg-reo-opex/eg-reo-opex-docs/guide/products/availability_and_trends/opxhub_ui/)

## App URL

| Environment | Endpoints                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Test        | [https://opxhub-ui.us-west-2.test.expedia.com/](https://opxhub-ui.us-west-2.test.expedia.com/) |
| Integration | [https://opxhub-ui.us-west-2.int.expedia.com/](https://opxhub-ui.us-west-2.int.expedia.com/)   |
| Prod        | [https://opxhub-ui.us-east-1.prod.expedia.com/](https://opxhub-ui.us-east-1.prod.expedia.com/) |

## VPCE

| Environment | Endpoints                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Prod        | opxhub-user-events-data-service                                                                |

## Logs

| Environment | Endpoints                                                                                                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test        | [https://splunk.test.egmonitoring.expedia.com/en-US/app/eg-opex-opxhub/opxhub_status_code_dashboard](https://splunk.test.egmonitoring.expedia.com/en-US/app/eg-opex-opxhub/opxhub_status_code_dashboard) |
| Prod        | [https://splunk.prod.egmonitoring.expedia.com/en-US/app/eg-opex-opxhub/opxhub_status_code_dashboard](https://splunk.prod.egmonitoring.expedia.com/en-US/app/eg-opex-opxhub/opxhub_status_code_dashboard) |

## Monitoring

| Environment | Endpoints                                                                                                                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test        | [https://grafana.test.expedia.com/d/ZPlMgQyZz/opxhub-ui-monitoring-dashboard?orgId=1&from=now-1d&to=now](https://grafana.test.expedia.com/d/ZPlMgQyZz/opxhub-ui-monitoring-dashboard?orgId=1&from=now-1d&to=now) |
| Prod        | [https://grafana.prod.expedia.com/d/rGyxu1mGz/opxhub-ui-monitoring-dashboard?orgId=1&from=now-1d&to=now](https://grafana.prod.expedia.com/d/rGyxu1mGz/opxhub-ui-monitoring-dashboard?orgId=1&from=now-1d&to=now) |

## Development

1. To start developing locally, clone the project:

   ```bash
   git clone git@github.expedia.biz:eg-reo-opex/opxhub-ui.git
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

### Project Structure

- Secrets & server config in src/server/manifest.json
- API routes registered in src/server/routes/api/index.js
- Page components & page-specific components in src/universal/pages
- Shared components in src/universal/components
- A typical component directory includes: index.js, styles.less, and tests directory

### Adding a new Page

1. Create page component in src/universal/pages
2. Register page with site menu in src/universal/pages/index.js
3. Register page via hapijs plugin in manifest.json under catalyst-render
4. Register page route in src/server/routes/pages
5. Done!

### Adding a New Endpoint

1. Add your custom serviceKey under server.app in manifest.json (unless a key for your hostname already exists, then just add your pathKey under the existing serviceKey) like so: 
```
"serviceKey": {
    "$filter": "env.EXPEDIA_ENVIRONMENT",
    "$default": {
        "hostname": "<HOSTNAME>",
          "protocol": "https:",
          "routes": {
            "pathKey": {
              "path": "/v1/custom-path",
              "method": "GET",
              "operation": "GET_CUSTOM_PATH"
            }
    },
    "test": { /* similar format to $default */},
    "prod": { /* similar format to $default */}
}
 ```
2. Add your new service js file under src/server/routes/api (unless the hostname/service already exists, skip this step) like so (remember to pass in your serviceKey defined in the manifest.json:
```
import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'serviceKey',
    serviceName: 'your-custom-service-name'
});

module.exports.apiPathKey = {
    method: 'GET',
    path: '/v1/custom-path',
    config: getConfig('custom-path-get'),
    handler: getHandler(Object.assign(getHandlerParams('serviceKey')))
};
```
3. Import the new apiPathKey in src/server/routes/api/index.js and add to apiRoutes array 
4. Your endpoint should now work after running npm start (e.g. localhost:8080/v1/custom-path)
5. Done!

###Tips for investigation UI Component

1. Read the file from the render function (usually bottom of file) to understand where in the UI to first investigate
2. Use the browser [developer tools](https://developer.chrome.com/docs/devtools/) to view Console and Network tabs

###Resources

Check if a common component already exists in [UI-Discovery Portal](https://ui-discovery.homeawaycorp.com/discovery/overview)
such as Dropdown, Navigation, etc. Also see the common [color palette](https://ui-discovery.homeawaycorp.com/discovery/web-components/base/colors#BaselineThemecolorpaletteandLessvariables)
and [SVG icon system](https://ui-discovery.homeawaycorp.com/discovery/web-components/base/icons#SVGIconSystem).

###Monitoring

- [Splunk dashboards](https://splunk.prod.egmonitoring.expedia.com/en-US/app/eg-opex-opxhub/dashboards)
- [Splunk](https://splunk.prod.egmonitoring.expedia.com/en-US/app/eg-opex-opxhub/search) search for API calls in the following format: 
```API-REQUEST-DETAILS"| spath "data.path" | search "data.path"="/v2/checkout-failure-category-counts"```
- [Support Rota](https://confluence.expedia.biz/pages/viewpage.action?spaceKey=REO&title=Support+Rota)
- [BigPanda](https://a.bigpanda.io/) (Search for host:"OpXHub Forecasting")

###Pipeline

- [Git](https://github.expedia.biz/eg-reo-opex/opxhub-ui)
- [Spinnaker](https://spinnaker.expedia.biz/#/applications/opxhub-ui/executions)