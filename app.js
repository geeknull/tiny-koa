const TinyKoa = require('./src/tiny-koa.js');
const app = new TinyKoa();
const port = 5678;

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

// curl http://localhost:5678/api/abc/12
router.all('/api/abc/:id', (ctx, next) => {
  console.log('/api/abc/:id');
  ctx.body = '/api/abc/:id';
  return next();
});

// curl http://localhost:5678/api/ccc
router.all('/api/ccc', (ctx, next) => {
  console.log('/api/ccc');
  ctx.body = '/api/ccc';
  return next();
});

// doT测试
router.all('/page/test', async (ctx, next) => {
  ctx.body = await render('tiny', {title: 'tiny dot template', body: 'powered by doT'});
});

let routeMiddleware = router.routes();
app.use(routeMiddleware);

app.use(async function m1 (ctx, next) {
  console.log('m1', ctx.path, ctx.method);
  ctx.body = 'm1';
  console.log(ctx.cookies.get(), 'ck');
  ctx.cookies.set('a', 'b');
  await next ();
});

// app.use(async function m2 (ctx, next) {
//   console.log('m2');
// });

app.use(server(__dirname + '/static'));

app.listen(port, () => {
  console.log(`listening ${port}`);
});
