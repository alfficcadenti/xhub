// simple redirect from root to application
module.exports = {
    method: 'GET',
    path: '/',
    options: {
        id: 'root',
        handler(request, h) {
            return h.redirect('/home');
        }
    }
};