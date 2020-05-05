
module.exports = function authHandler(request, h, template, body, context, requireDevAuth = false) {
    if (!requireDevAuth || process.env.NODE_ENV === 'development') {
        return h.view(template, {body, ...context});
    }
    if ('code' in request.query) {
        return request.oauthClient.login(request).then((id) => {
            const ttl = id.exp - id.iat;
            return h
                .view(template, {body, ...context})
                .header('Set-Cookie', `access_token=${id.tokenDecoded.token};Path=/;HttpOnly;Max-Age=${ttl};`)
                .header('Set-Cookie', `email=${id.email};Path=/;Max-Age=${ttl};`, {'append': true});
        }).catch((e) => {
            request.log('Login error', e);
            return h.redirect(request.oauthClient.authorizeUrl(request));
        });
    }
    if ('access_token' in request.state) {
        return request.oauthClient.verify(request.state.access_token)
            .then(() => h.view(template, {body, ...context}))
            .catch(() => h.redirect(request.oauthClient.authorizeUrl(request)));
    }
    return h.redirect(request.oauthClient.authorizeUrl(request));
};
