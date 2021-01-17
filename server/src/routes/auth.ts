import Router from 'koa-router';
import AuthController from '../controllers/auth'

const router = new Router({
  prefix: '/auth/client'
});

router.get('/', () => { })
  .post('/', AuthController.getToken)

export default router;
