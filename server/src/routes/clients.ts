import Router from "koa-router";
import ClientsController from "../controllers/clients";
import { isAuthenticated, isAuthorized } from "../controllers/auth";

const router = new Router({
  prefix: "/clients",
});

router
  .get(
    "/",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"] }),
    ClientsController.find
  )
  .post(
    "/",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"] }),
    ClientsController.create
  )
  .get(
    "/:id",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    ClientsController.findOne
  )
  .patch(
    "/:id",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    ClientsController.update
  )
  .delete(
    "/:id",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    ClientsController.delete
  );

export default router;
