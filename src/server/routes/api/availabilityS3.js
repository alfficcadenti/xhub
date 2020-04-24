const aws = require('aws-sdk');


const s3 = new aws.S3();
const params = {
    Bucket: 'iota-dash',
    Key: 'covid_19/covid19_file.txt'
};

module.exports.availabilityS3 = {
    method: 'GET',
    path: '/availability/s3bucket',
    options: {
        id: 'availabilityS3'
    },
    handler: async (request, h) => {
        try {
            const data = await s3.getObject(params).promise();

            return data.Body.toString();
        } catch (error) {
            return h.response(error.message).code(500);
        }
    }
};
