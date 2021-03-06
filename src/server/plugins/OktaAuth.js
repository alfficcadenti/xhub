const _ = require('lodash-chain');
const ServiceClient = require('@vrbo/service-client');
const jws = require('jws');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

class OktaAuth {
    constructor(server) {
        this.clientId = (process.env.NODE_ENV === 'development') ?
            require('../../../devOkta.json').okta.oauthClientId :
            server.app.config.get('oauthApi.oauthClientId');
        this.oauthUrl = `${server.app.config.get('oauthApi.protocol')}//${server.app.config.get('oauthApi.hostname')}`;
        this.oauthApiClient = ServiceClient.create('oauthClient', {
            timeout: server.app.config.get('oauthApi.timeout'),
            connectTimeout: server.app.config.get('oauthApi.connectTimeout'),
            protocol: server.app.config.get('oauthApi.protocol'),
            hostname: server.app.config.get('oauthApi.hostname')
        });
        this.keys = {};
        this.id_token = '';
    }

    getKey(token) {
        const decoded = jws.decode(token);
        if (!(decoded && 'header' in decoded && 'kid' in decoded.header)) {
            const parts = token.split('.');
            throw `Invalid token: ${parts[0]}.${parts[1]}`;
        }
        const kid = decoded.header.kid;
        if (kid in this.keys) {
            return Promise.resolve(this.keys[kid]);
        }
        return this.getKeys().then((keys) => {
            if (kid in this.keys) {
                return keys[kid];
            }
            throw 'Invalid key';
        });
    }

    getKeys() {
        return this.oauthApiClient
            .request({
                method: 'GET',
                path: '/oauth2/v1/keys',
                queryParams: {client_id: this.clientId},
                operation: 'get_oauth_keys'
            })
            .then(({payload}) => {
                const keys = _.chain(payload.keys)
                    .map((jwk) => {
                        return {
                            kid: jwk.kid,
                            jwk,
                            pem: jwkToPem(jwk)
                        };
                    })
                    .keyBy((o) => o.kid)
                    .value();
                this.keys = keys;
                return this.keys;
            });
    }

    verify(token) {
        try {
            return this.getKey(token).then((key) => {
                return jwt.verify(token, key.pem);
            })
                .catch(() => {
                    return jws.decode(token).payload;
                });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    getSecrets(server) {
        if (process.env.NODE_ENV === 'development') {
            return Promise.resolve({'oauthClientSecret': require('../../../devOkta.json').okta.oauthClientSecret});
        }
        return Promise.resolve({'oauthClientSecret': server.app.config.get('secrets.oauthClientSecret')});
    }

    getClientSecret({server}) {
        return this.getSecrets(server)
            .then((secrets) => secrets.oauthClientSecret);
    }

    redirectUri(request) {
        const protocol = (process.env.NODE_ENV === 'development') ? 'http' : 'https';
        const url = request.info.path ? `${protocol}%3A%2F%2F${request.info.host}${request.info.path}` : `${protocol}%3A%2F%2F${request.info.host}%2Fhome`;
        return url;
    }

    authorizeUrl(request) {
        return `${this.oauthUrl}/oauth2/v1/authorize?` +
            `client_id=${this.clientId}` +
            '&response_type=code' +
            '&state=S0M3St4t3' +
            `&redirect_uri=${this.redirectUri(request)}` +
            '&scope=openid%20email';
    }

    login(request) {
        return this.getClientSecret(request).then((clientSecret) => {
            const formData = `code=${request.query.code}` +
                `&client_id=${this.clientId}` +
                `&client_secret=${clientSecret}` +
                `&redirect_uri=${this.redirectUri(request)}` +
                '&grant_type=authorization_code';
            return this.oauthApiClient.request({
                method: 'POST',
                path: '/oauth2/v1/token',
                operation: 'post_oauth_token',
                payload: formData,
                headers: {'content-type': 'application/x-www-form-urlencoded'}
            }).then((oauthResponse) => {
                const mysecret = clientSecret || 'none';
                if (oauthResponse.statusCode !== 200) {
                    throw `Invalid OAuth response (Status ${oauthResponse.statusCode} / ${mysecret.substring(0, 3)}...${mysecret.substring(mysecret.length - 3)}): ${JSON.stringify(oauthResponse.payload)}`;
                }
                if (!('access_token' in oauthResponse.payload)) {
                    throw `Invalid OAuth response: ${JSON.stringify(oauthResponse.payload)}`;
                }
                const token = oauthResponse.payload.access_token;
                this.id_token = oauthResponse.payload.id_token;
                return this.verify(token).then((decoded) => {
                    return {
                        ...decoded,
                        token
                    };
                });
            }).then((tokenDecoded) => {
                return this.oauthApiClient.request({
                    method: 'POST',
                    path: '/oauth2/v1/userinfo',
                    operation: 'post_oauth_userinfo',
                    headers: {'Authorization': `Bearer ${tokenDecoded.token}`}
                }).then((data) => {
                    const {email} = data.payload;
                    return {email, tokenDecoded};
                });
            });
        });
    }
}

function plugin(server) {
    const oauthClient = new OktaAuth(server);
    server.decorate('server', 'oauthClient', oauthClient);
    server.decorate('request', 'oauthClient', oauthClient);
}

module.exports.plugin = {register: plugin, name: 'oauthClient', version: '1'};
