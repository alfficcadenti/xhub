const questions = [
    {id: 1, question: 'Regions'},
    {id: 2, question: '#AZs'},
    {id: 3, question: '#Instances'},
    {id: 4, question: 'Segment?'},
    {id: 5, question: 'Chaos?'},
    {id: 6, question: 'AS Verified?'},
    {id: 7, question: 'SPOF?'},
    {id: 8, question: '4 Golden Indicators'},
    {id: 9, question: '% Prod Traffic'},
    {id: 10, question: 'Rev Loss pm'},
    {id: 11, question: 'Multi-Region ETA'},
    {id: 12, question: 'Resilient ETA'},
    {id: 13, question: 'Pipeline Leadtime'},
    {id: 14, question: 'Release Cadence'},
    {id: 15, question: 'Release Confirmation'},
    {id: 16, question: 'Rollback Time'},
    {id: 17, question: 'Rollback Exercise Cadence'},
    {id: 18, question: 'Release Success Rate'},
    {id: 19, question: 'Circuit Breakers'},
    {id: 20, question: 'Throttling'},
    {id: 21, question: 'Notes'}
]

module.exports = {
    method: 'GET',
    path: '/api/resiliency-questions',
    options: {
        id: 'resiliencyQuestions',
        handler: () => (questions)
    }
}; 