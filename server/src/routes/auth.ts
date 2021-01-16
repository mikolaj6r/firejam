import Router from 'koa-router';
import AuthController, { isAuthenticated, isAuthorized }  from '../controllers/auth'

const router = new Router({
  prefix: '/auth/clients'
});

router
  .get('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), AuthController.find)
  .post('/', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), AuthController.create)
  .get('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), AuthController.findOne)
  .patch('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }), AuthController.update)
  .delete('/:id', isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }), AuthController.delete)

export default router;
