import Koa from "koa";

//import * as admin from 'firebase-admin'
import * as functions from "firebase-functions";

import authServices from "../services/auth";
import jwtServices from "../services/jwt";

import { RoleEnum } from "../schemas/role";

export default {
  async getToken(ctx: Koa.Context) {
    const { token } = ctx.request.body;

    try {
      const jwt = await authServices.createJWTToken(token);

      if (!jwt) return ctx.throw(400, `Error creating JWT token for client`);

      return (ctx.body = {
        status: "success",
        json: jwt,
      });
    } catch (error) {
      return ctx.throw(400, `Error creating JWT token for client`);
    }
  },
};

// TODO(mikolaj6r): refactor
export async function isAuthenticated(
  ctx: Koa.Context,
  next: () => Promise<any>
) {
  const { authorization } = ctx.req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      let token = authorization.split(" ");

      let decodedToken = await jwtServices.verify(token[1]);

      ctx.state.requester = decodedToken;
      return next();
    } catch (err) {
      ctx.state.requester = undefined;
      console.log(err);
      return ctx.throw(401, `Unauthorized - ${err.toString()}`);
    }
  } else {
    ctx.state.requester = undefined;

    return ctx.throw(401, "Unauthorized - Missing authorization header");
  }
}

export function isAuthorized(opts: {
  hasRole: Array<RoleEnum>;
  allowSameUser?: boolean;
}) {
  return (ctx: Koa.Context, next: () => Promise<any>) => {
    console.log(ctx.state.requester);
    const { data, type } = ctx.state.requester;
    const { id } = ctx.params;

    const { id: requesterId } = data;

    if (opts.allowSameUser && id && requesterId === id) return next();

    if (type === "user") {
      if (data.email === functions.config().rootuser.email) return next();
    }

    if (!data.role) {
      return ctx.throw(403, "Forbidden - Missing role");
    }

    if (opts.hasRole.includes(data.role)) return next();

    return ctx.throw(
      403,
      "Forbidden - User does not have required permissions"
    );
  };
}
