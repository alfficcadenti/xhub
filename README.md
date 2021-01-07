# OpXHub-UI

A [Catalyst](https://pages.github.expedia.biz/Catalyst/information/guide/introduction) web application that retrieves, organizes, and presents operational metrics across brands. OpXhub-UI is a [React](https://reactjs.org/) web application that runs on [Hapijs](https://hapi.dev/tutorials), an enterprise-grade [node](https://nodejs.org/) server system. [Recharts](https://recharts.org/) is the primary library used for its data visualizations.

See our official documentation [here](https://pages.github.expedia.biz/eg-reo-opex/eg-reo-opex-docs/guide/products/availability_and_trends/opxhub_ui/)

## App URL

| Environment | Endpoints                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Test        | [https://opxhub-ui.us-west-2.test.expedia.com/](https://opxhub-ui.us-west-2.test.expedia.com/) |
| Integration | [https://opxhub-ui.us-west-2.int.expedia.com/](https://opxhub-ui.us-west-2.int.expedia.com/)   |
| Prod        | [https://opxhub-ui.us-west-2.prod.expedia.com/](https://opxhub-ui.us-west-2.prod.expedia.com/) |

Kumo: https://console.kumo.expedia.biz/apps/opxhub-ui

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

## Contributing

See our official documentation [here](https://pages.github.expedia.biz/eg-reo-opex/eg-reo-opex-docs/guide/products/availability_and_trends/opxhub_ui/)
