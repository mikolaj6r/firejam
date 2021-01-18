import Router from 'koa-router';
import PageControllers from '../controllers/page'
import { isAuthenticated, isAuthorized } from "../controllers/auth";

const router = new Router({
  prefix: '/pages'
});

router
  .get('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), PageControllers.find)
  .post('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), PageControllers.create)
  .get('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), PageControllers.findOne)
  .patch('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), PageControllers.update)
  .delete('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), PageControllers.delete)

export default router;
