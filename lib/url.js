var qs = require('decanat-querystring');

/**
 * RegExp to retreive 'auth' portion from url.
 */

var reauth = /^([a-z]+:\/\/)?([a-z0-9_-]+:.*?)@/i;

/**
 * Parse the given `url`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(urlStr, parseQueryString){
    var a = document.createElement('a');
    a.href = urlStr;

    var creds   = reauth.exec(urlStr);

    var search  = a.search,
        query   = search.slice(1);

    if (query && parseQueryString)
        query = qs.parse(query);

    return {
        href: a.href,
        auth: creds && creds[2],
        host: a.host || location.host,
        port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
        hash: a.hash,
        hostname: a.hostname || location.hostname,
        pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
        protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
        search: search,
        query: query
    };
};

/**
 * Check if `url` is absolute.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isAbsolute = function(url){
    return 0 == url.indexOf('//') || !!~url.indexOf('://');
};

/**
 * Check if `url` is relative.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isRelative = function(url){
    return !exports.isAbsolute(url);
};

/**
 * Check if `url` is cross domain.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isCrossDomain = function(url){
    url = exports.parse(url);
    return url.hostname !== location.hostname
        || url.port !== location.port
        || url.protocol !== location.protocol;
};

/**
 * Return default port for `protocol`.
 *
 * @param  {String} protocol
 * @return {String}
 * @api private
 */
function port (protocol){
    switch (protocol) {
        case 'http:':
            return 80;
        case 'https:':
            return 443;
        default:
            return location.port;
    }
}
