import incidentQuery from '../../utils/incidentQuery'

module.exports = {
    method: 'GET',
    path: '/api/incident-data',
    options: {
        id: 'api-incident-data',
        handler(req) {
                const {server: {app: {config}}} = req
                return incidentQuery(config)
                    .then((res) => res)
                    .catch((err) => {
                        req.log(['api'],['incidentData'], err)
                        return err;
                    });
          }
    }
};