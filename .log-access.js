module.exports = {
    filter(data) { return data.msg === 'request completed' },
    output: {
        path: "access.log", // name of file
        options: {
            path: "logs/", // path to write fils
            size: "10M", // max size
            rotate: 5 // keep 5 rotated logs
        }
    }
}