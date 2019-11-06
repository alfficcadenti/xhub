const questionnaire = [
    {   "timestamp": "2019-09-09",
        "product":{"id":4,"name":"Operations"},
        "application":{"id":2352,"name":"sast-service"},
        "questions":[{"key":"Regions","value":'us-west-2 us-east-1'},{"key":"#AZs","value":"2"},{"key":"#Instances","value":"5"},{"key":"Segment?","value":"Yes"},{"key":"Chaos?","value":"Yes"},{"key":"AS Verified?","value":"No"},{"key":"SPOF?","value":"database A"},{"key":"4 Golden Indicators","value":"request x TP95 - 5xx Count"},{"key":"% Prod Traffic","value":"100%"},{"key":"Rev Loss pm","value":"$30,000"},{"key":"Multi-Region ETA","value":"30/Aug/20"},{"key":"Resilient ETA","value":"31/Jun/20"},{"key":"Pipeline Leadtime","value":""},{"key":"Release Cadence","value":"70%"},{"key":"Release Confirmation","value":"30 mins"},{"key":"Rollback Time","value":"20 mins"},{"key":"Rollback Exercise Cadence","value":""},{"key":"Release Success Rate","value":""},{"key":"Circuit Breakers","value":""},{"key":"Throttling","value":""},{"key":"Notes","value":""}]
    },
    {   
        "timestamp": "2019-09-08",
        "product":{"id":4,"name":"Operations"},
        "application":{"id":2352,"name":"sast-service"},
        "questions":[{"key":"Regions","value":'us-west-2 us-east-1'},{"key":"#AZs","value":"2"},{"key":"#Instances","value":"5"},{"key":"Segment?","value":"Yes"},{"key":"Chaos?","value":"Yes"},{"key":"AS Verified?","value":"No"},{"key":"SPOF?","value":"database A"},{"key":"4 Golden Indicators","value":"request x TP95 - 5xx Count"},{"key":"% Prod Traffic","value":"100%"},{"key":"Rev Loss pm","value":"$30,000"},{"key":"Multi-Region ETA","value":"30/Aug/20"},{"key":"Resilient ETA","value":"31/Jun/20"},{"key":"Pipeline Leadtime","value":""},{"key":"Release Cadence","value":"70%"},{"key":"Release Confirmation","value":"30 mins"},{"key":"Rollback Time","value":"20 mins"},{"key":"Rollback Exercise Cadence","value":""},{"key":"Release Success Rate","value":""},{"key":"Circuit Breakers","value":""},{"key":"Throttling","value":""},{"key":"Notes","value":""}]
    }
]

module.exports = {
    method: 'GET',
    path: '/api/questionnaire-history',
    options: {
        log: {
            collect: true
          },
        id: 'questionnaireHistory',
        handler: () => (questionnaire)
    }
}; 