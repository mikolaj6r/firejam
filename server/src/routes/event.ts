import Router from 'koa-router';
import EventControllers from '../controllers/event'
import { isAuthenticated, isAuthorized } from "../controllers/auth";

const router = new Router({
  prefix: '/events'
});

router
  .get('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), EventControllers.find)
  .post('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), EventControllers.create)
  .get('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), EventControllers.findOne)
  .patch('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), EventControllers.update)
  .delete('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), EventControllers.delete)

export default router;
