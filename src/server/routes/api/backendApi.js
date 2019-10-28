module.exports = {
    method: 'GET',
    path: '/api/v1/{param*}',
    options: {
        id: 'backend-api-get',
        handler: (req,h) => {
            return h.proxy({
              host: 'opxhub-service.us-west-2.test.expedia.com',
              port: '443',
              protocol: 'https'
            })
          }
    }
};