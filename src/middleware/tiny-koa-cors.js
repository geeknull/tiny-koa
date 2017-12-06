'use strict';

module.exports = (config) => {
  return (ctx, next) => {
    let setHeaders = () => {
      if (ctx.req.headers.origin) {
        ctx.res.setHeader('Access-Control-Allow-Origin', ctx.req.headers.origin);
        ctx.res.setHeader('Access-Control-Allow-Credentials', 'true');
        ctx.res.setHeader('Access-Control-Allow-Headers', ctx.req.headers['access-control-request-headers'] || 'content-type' );
        ctx.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
      }
    };

    setHeaders();
    if (ctx.req.method.toUpperCase() === 'OPTIONS') { 
      ctx.res.writeHead(200);
    } else {
      return next();
    }
  }
}
