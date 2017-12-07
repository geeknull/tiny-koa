const TinyKoa = require('./src/tiny-koa.js');
const app = new TinyKoa();
const port = 8600;

const Router = require('./src/middleware/tiny-koa-router.js');
const router = new Router();

const cors = require('./src/middleware/tiny-koa-cors.js');
const bodyparser = require('./src/middleware/tiny-koa-body.js');
const server = require('./src/middleware/tiny-koa-static.js');
const koaCookies = require('./src/middleware/tiny-koa-cookie.js');
const views = require('./src/middleware/tiny-koa-views.js');
let render = views({
  root: __dirname + '/views'
});

app.use(cors());
app.use(koaCookies());
app.use(bodyparser());

app.use(async function ck (ctx, next) {
  console.log('set cookie', ctx.path);
  ctx.cookies.set('path', decodeURIComponent(ctx.path));
  await next ();
});

// curl http://localhost:8600/api/foo/123
router.all('/api/foo/:id', (ctx, next) => {
  // console.log('/api/foo/:id');
  ctx.body = {
    param: {
      id: ctx.params.id
    },
    route: '/api/foo/:id'
  };
  // return next(); // if match not to next
});

// curl http://localhost:8600/api/ccc
router.all('/api/bar', (ctx, next) => {
  // console.log('/api/bar');
  ctx.body = {
    route: '/api/bar'
  };
  // return next(); // if match not to next
});

// doT测试
router.all('/page/tpl', async (ctx, next) => {
  ctx.body = await render('tiny', {title: 'tiny dot template', body: 'powered by doT'});
});

let routeMiddleware = router.routes();
app.use(routeMiddleware);

app.use(async (ctx, next) => {
  console.log('body test', ctx.req.body);
  if (ctx.path === '/api/fetch') {
    ctx.body = ctx.req.body;
  } else {
    return next();
  }
});

app.use(server(__dirname + '/static'));

app.listen(port, () => {
  console.log(`listening ${port}`);
});
