module.exports = {
    method: 'GET',
    path: '/api/v1/{param*}',
    options: {
      log: {
        collect: true
      },
        id: 'backend-api-get',
        handler: (req,h) => {
          const {server: {app: {secrets}}} = req
          req.log(['TEST-secrets'],secrets);
          req.log(['INFO-request']);   
              return h.proxy({
              host: 'opxhub-service.us-west-2.test.expedia.com',
              port: '443',
              protocol: 'https'
            })
        }
    }
}

