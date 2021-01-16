import Router from 'koa-router';
import UserController from '../controllers/users'

const router = new Router({
  prefix: '/users'
});

router
  .get('/', UserController.getAllUsers)
  .post('/', UserController.createUser)
  .get('/:id', UserController.getUser)
  .patch('/:id', UserController.updateUser)
  .delete('/:id', UserController.deleteUser)

export default router;
