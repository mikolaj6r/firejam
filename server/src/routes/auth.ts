import Router from 'koa-router';

const router = new Router({
  prefix: '/auth'
});

router.get('/', async function (ctx) {
  ctx.body = 'Hello World!';

});

router.get('/:id', async function (ctx) {
  ctx.body = 'Hello World!';

});

export default router;
