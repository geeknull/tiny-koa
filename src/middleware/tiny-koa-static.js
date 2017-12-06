'use strict';
const fs = require('fs');
const Stream = require('stream');

module.exports = (config) => {
  let staticDir = null;
  if (typeof config === 'string') {
    staticDir = config;
  }

  return async (ctx, next) => {
    let statInfo = false;
    let filePath = staticDir + ctx.path;
    try {
      statInfo = fs.statSync(filePath);
    } catch (err) {}
  
    if (statInfo && statInfo.isFile()) {  
      // TODO 应该用Accept更准确点
      let index = filePath.lastIndexOf(".");
      let ext = filePath.substr(index+1);
      switch(ext) {
        case 'html':
          ctx.res.setHeader('Content-Type', 'text/html; charset=utf-8');
          break;
        case 'js':
          ctx.res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
          break;
        case 'css':
          ctx.res.setHeader('Content-Type', 'text/css; charset=utf-8');
          break;
      }

      let rs = fs.createReadStream(filePath);
      ctx.body = rs;
    } else {
      return next();
    }
  }
};
