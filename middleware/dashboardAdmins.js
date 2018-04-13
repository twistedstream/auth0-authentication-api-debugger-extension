const url = require('url');
const auth0 = require('auth0-oauth2-express@1.2.0');

module.exports = function(domain, title, rta) {
  if (!domain) throw new Error('Domain is required');
  if (!title) throw new Error('Title is required');

  const options = {
    credentialsRequired: false,
    scopes: 'read:clients read:client_keys',
    clientName: title,
    audience: function() {
      return 'https://' + domain + '/api/v2/';
    },
    rootTenantAuthority: rta
  };

  const middleware = auth0(options);
  return function(req, res, next) {
    const protocol = 'https';
    const pathname = url.parse(req.originalUrl).pathname.replace(req.path, '');
    const baseUrl = url.format({
      protocol: protocol,
      host: req.get('host'),
      pathname: pathname
    });

    options.clientId = baseUrl;
    return middleware(req, res, next);
  };
};
