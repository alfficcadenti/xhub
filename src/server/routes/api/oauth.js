/* Handler for login */
function login(request, response) {
    if ('code' in request.query) {
        return request.oauthClient.login(request).then((id) => {
            const ttl = id.exp - id.iat;
            return response
                .redirect('/home')
                .header('Set-Cookie', `access_token=${id.tokenDecoded.token};Path=/;HttpOnly;Max-Age=${ttl};`)
                .header('Set-Cookie', `email=${id.email};Path=/;Max-Age=${ttl};`, {'append': true});
        }).catch((e) => {
            request.log('Login error', e); // eslint-disable-line no-console
            return response.redirect(request.oauthClient.authorizeUrl(request));
        });
    }
    if ('access_token' in request.state) {
        return request.oauthClient.verify(request.state.access_token)
            .then(() => response.redirect('/home'))
            .catch(() => response.redirect(request.oauthClient.authorizeUrl(request)));
    }
    return response.redirect(request.oauthClient.authorizeUrl(request));
}

/* Handler for logout */
function logout(request, response) {
    return response
        .redirect('/')
        .header('Set-Cookie', 'access_token=;Path=/;Max-Age=1;HttpOnly;')// erase cookies
        .header('Set-Cookie', 'access_token=;Path=/;Max-Age=1;', {'append': true});// erase cookies
}


module.exports.login = {
    method: 'GET',
    path: '/login',
    handler: (req, h) => login(req, h),
    options: {id: 'login'}
};


module.exports.logout = {
    method: 'GET',
    path: '/logout',
    handler: (req, h) => logout(req, h),
    options: {id: 'logout'}
};
