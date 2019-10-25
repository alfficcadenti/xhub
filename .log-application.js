module.exports = {
    filter(data) {
        if (!data.tags || !data.tags.includes('error')) {
            data.identifier = 'support:server';
        }
        return true;
    },
    output: {
        path: "opxhub.txt", // name of file
        options: {
            path: "logs/", // path to write fils
            size: "10M", // max size
            rotate: 5 // keep 5 rotated logs
        }
    }
}