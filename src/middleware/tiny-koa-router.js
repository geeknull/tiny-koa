'use strict';

const Route = class {
  constructor(path, method, route) {
    this.path = path;
    this.method = method.toUpperCase();
    this.route = (ctx, next) => {
      ctx.params = this.params;
      route(ctx, next);
    };
    this.params = {};
  }

  match(reqPath) {
    let paramsObj = {};

    let routePathArr = this.path.split('/').filter(_=>_!=='');
    let reqPathArr = reqPath.split('/').filter(_=>_!=='');

    if (routePathArr.length !== reqPathArr.length) {
      return false;
    }

    for (let i = 0, len = routePathArr.length; i < len; i++) {
      let route = routePathArr[i];
      let isParam = route.startsWith(':');

      if (isParam) {
        let paramKey = route.slice(1);
        paramsObj[paramKey] = reqPathArr[i];
      } else if(route !== reqPathArr[i]) {
        return false;
      }
    }
    this.params = paramsObj;

    return true;
  }
};

const TinyKoaRouter = class {
  constructor() {
    this.routeStack = [];
    this.methods = ['get', 'post'];
    this.methods.forEach((method) => {
      TinyKoaRouter.prototype[method] = (path, route) => {
        this.routeStack.push(new Route(path, method, route));
      }
    });
  }

  all(path, route) {
    this.routeStack.push(new Route(path, 'all', route));
  }

  getMatchRoutes(reqPath) {
    return this.routeStack.filter((item) => {
      return item.match(reqPath);
    });
  }

  routes() {
    return async (ctx, next) => {
      let routePath = ctx.path;

      let matchRouts = this.getMatchRoutes(routePath);
      if (matchRouts.length === 0) {
        return next();
      }

      let dispatch = (i) => {
        if (i === matchRouts.length) {
          return next(); // to next middleware
        }
        let route = matchRouts[i].route;

        let routeWrap = () => {
          return route(ctx, () => {
            return dispatch(i+1);
          });
        };

        return Promise.resolve(routeWrap());
      };

      return dispatch(0);
    }
  }
};

module.exports = TinyKoaRouter;
