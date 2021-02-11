import Router from "koa-router";
import UserController from "../controllers/users";
import { isAuthenticated, isAuthorized } from "../controllers/auth";

const router = new Router({
  prefix: "/users",
});

router
  .get(
    "/",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"] }),
    UserController.find
  )
  .post("/", UserController.create)
  .get(
    "/:id",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    UserController.findOne
  )
  .patch(
    "/:id",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    UserController.update
  )
  .delete(
    "/:id",
    isAuthenticated,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true }),
    UserController.delete
  );

export default router;
