import Router from 'koa-router';
import UserController from '../controllers/users'

const router = new Router({
  prefix: '/users'
});

router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getUser);

export default router;
