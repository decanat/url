var type = require('component-type');

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

    var auth = reauth.exec(urlStr);

    //
    var pathname = a.pathname;

    if (pathname.charAt(0) != '/')
        pathname = '/' + pathname; 
    
    //
    var search = a.search,
        query  = search.slice(1);

    if (parseQueryString)
        query = qs.parse(query);

    return {
        href: a.href,
        auth: auth && auth[2],
        host: a.host || location.host,
        port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
        hash: a.hash,
        hostname: a.hostname || location.hostname,
        pathname: pathname,
        path: pathname + search,
        protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
        search: search,
        query: query
    };
};

/**
 * Return formatted URL string from parsed object.
 *
 * @param  {Object} urlObj
 * @return {String}
 */

exports.format = function(urlObj) {
    var auth = urlObj.auth
            ? urlObj.auth + '@'
            : '';

    var query = urlObj.query,
        search = '';

    if (typeof query == 'string' && query !== '') {
        search = '?' + query;
    } else if (type(query) == 'object' && Object.keys(query).length) {
        search = '?' + qs.stringify(query);
    }

    return urlObj.protocol + '//'
        +  auth
        +  urlObj.host
        +  urlObj.pathname
        +  search;
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
