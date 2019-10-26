const sample = {
    "links": [
      {
        "rel": "self",
        "href": "https://rambo-annotated.tools.expedia.com/api/products?limit=2"
      }
    ],
    "content": [
      {
        "id": 1,
        "name": "Traffic Engineering",
        "lineOfBusiness": "Shared Platform and Operations",
        "lineOfBusinessId": 1,
        "lineOfBusinessTagFriendlyName": "Shared Platform and Operations",
        "productTagFriendlyName": "Traffic Engineering",
        "active": true,
        "links": [
          {
            "rel": "self",
            "href": "https://rambo-annotated.tools.expedia.com/api/products/1"
          },
          {
            "rel": "lineOfBusiness",
            "href": "https://rambo-annotated.tools.expedia.com/api/linesOfBusinesses/1"
          }
        ]
      },
      {
        "id": 2,
        "name": "Quality Engineering",
        "lineOfBusiness": "Shared Platform and Operations",
        "lineOfBusinessId": 1,
        "lineOfBusinessTagFriendlyName": "Shared Platform and Operations",
        "productTagFriendlyName": "Quality Engineering",
        "active": true,
        "links": [
          {
            "rel": "self",
            "href": "https://rambo-annotated.tools.expedia.com/api/products/2"
          },
          {
            "rel": "lineOfBusiness",
            "href": "https://rambo-annotated.tools.expedia.com/api/linesOfBusinesses/1"
          }
        ]
      }
    ]
  }

module.exports = {
    method: 'GET',
    path: '/api/product-list',
    options: {
        id: 'api-product-list',
        handler: () => {
          // eslint-disable-next-line no-console
          // console.log('HERE',h.proxy);
          //   return h.proxy({
          //     //host: 'operational-insights-service-production.us-east-1-vpc-d9087bbe.slb.prod.aws.away.black',
          //     host: 'opxhub-service.us-west-2.test.expedia.com/api/v1/incidents',
          //     port: '443',
          //     protocol: 'https'
          //   })
                return sample.content;
                    // .then((res) => res)
                    // .catch((err) => {
                    //     req.log(['api'],['productList'], err)
                    //     return err;
                    // });
          }
    }
};