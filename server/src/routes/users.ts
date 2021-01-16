import Router from 'koa-router';
import UserController from '../controllers/users'
import { isAuthenticated, isAuthorized } from "../controllers/auth";

const router = new Router({
  prefix: '/users'
});

router
  .get('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), UserController.getAllUsers)
  .post('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), UserController.createUser)
  .get('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), UserController.getUser)
  .patch('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), UserController.updateUser)
  .delete('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), UserController.deleteUser)

export default router;
