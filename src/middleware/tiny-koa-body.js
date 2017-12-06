'use strict';

module.exports = (config) => {
  const jsonTypes = 'application/json';
  const formTypes = 'application/x-www-form-urlencoded';
  const textTypes = 'text/plain';

  return async (ctx, next) => {
    let reqStr = await new Promise((resolve, reject) => {
      let data = '';
      ctx.req.on('data', chunk => {
        data += chunk;
      });
      ctx.req.on('end', () => {
        resolve(data);
      })
    });

    if (ctx.method.toUpperCase() === 'options') {
      return next();
    }

    let curTypes = ctx.req.headers['content-type'] || textTypes;
    if (curTypes.includes(jsonTypes)) {
      ctx.req.body = JSON.parse(reqStr || "null"); // TODO try
    } else if (curTypes.includes(formTypes)) {
      let formArr = reqStr.split('&');
      let formObj = {};
      formArr.forEach((item) => {
        let formItem = item.split('=');
        formItem = formItem.map(_=>decodeURIComponent(_));
        formObj[formItem[0]] = formItem[1];
      });
      ctx.req.body = formObj;
    } else {
      ctx.req.body = reqStr;
    }

    return next();
  }
};
