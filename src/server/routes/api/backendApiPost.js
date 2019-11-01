module.exports = {
    method: 'POST',
    path: '/api/v1/resiliency/questionnaire',
    config: {
        id: 'backend-api-post',
        log: {
          collect: true
        },
        payload: {
            parse: false,
            output: 'stream'
          },
        handler: (req,h) => {
          req.log('error', 'Event error')
            return h.proxy({
              host: 'opxhub-service.us-west-2.test.expedia.com',
              port: '443',
              protocol: 'https'
            })
        }
    }
}