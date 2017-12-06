'use strict';
const http = require('http');
const url = require('url');
const URL = url.URL;
const Stream = require('stream');

module.exports = class TinyKoa {
  constructor() {
    this.middleware = [];
    this.body = '';
  }

  use(fn) {
    this.middleware.push(fn);
  }

  compose (ctx) {
    let dispatch = (i) => {
      if (i === this.middleware.length) {
        return Promise.resolve();
      }

      let midFn = this.middleware[i];

      let midFnWrap = () => {
        return midFn(ctx, () => {
          return dispatch(i+1);
        });
      };

      return Promise.resolve(midFnWrap());
    };

    return dispatch(0);
  }

  listen(port, cb) {
    const server = http.createServer((req, res) => {
      res.statusCode = 404;

      // TODO ctx
      let ctx = {};
      ctx.req = req;
      ctx.res = res;
      ctx.path = url.parse(req.url).pathname;
      ctx.method = req.method;

      let middlewareCompose = this.compose(ctx);
      middlewareCompose.then(() => {
        // TODO 其他数据类型
        let body = ctx.body; 

        if (ctx.res.headersSent) {
          res.end();
        } else {
          res.statusCode = 200;
        }
        if (body === undefined) {
          res.statusCode = 404;
        }

        if (body instanceof Stream) {
          return body.pipe(res);
        }

        if (typeof body !== 'string') {
          body = JSON.stringify(body);
        }

        res.end(body || 'not found');
      }).catch(err => {
        console.log(err);
      })
    });
    server.listen(port, cb);
  }
};
