// simple redirect from root to application
module.exports = {
    method: 'GET',
    path: '/',
    options: {
        id: 'root',
        handler(request, h) {
            return (process.env.NODE_ENV === 'development')
                ? h.redirect('/home')
                : h.redirect('/login');
        }
    }
};