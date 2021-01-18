import Router from 'koa-router';
import PostControllers from '../controllers/post'
import { isAuthenticated, isAuthorized } from "../controllers/auth";

const router = new Router({
  prefix: '/posts'
});

router
  .get('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), PostControllers.find)
  .post('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), PostControllers.create)
  .get('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), PostControllers.findOne)
  .patch('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), PostControllers.update)
  .delete('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), PostControllers.delete)

export default router;
