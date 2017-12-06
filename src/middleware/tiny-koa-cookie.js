'use strict';

module.exports = (config) => {
  return (ctx, next) => {
    let {cookie=''} = ctx.req.headers;
    let cookieObj = {};
    let cookieArr = cookie.split(';');
    
    cookieArr.forEach(item => {
      let itemSplit = item.split('=');
      cookieObj[itemSplit[0]] = unescape(itemSplit[1]);
    });

    ctx.cookies = {
      get: (key) => {
        if (key === undefined) {
          return cookieObj;
        }
        return cookieObj[key];
      },
      set: (key, value) => {
        // TODO cookie其他字段
        ctx.res.setHeader('Set-Cookie', `${key}=${value}`);
      }
    };
    return next();
  }
}
