import Koa from 'koa';

//import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions';

import authServices from '../services/auth';
import jwtServices from '../services/jwt';


export default {
  async getToken(ctx: Koa.Context) {
    const { token } = ctx.request.body;

    const jwt = await authServices.createJWTToken(token);

    return ctx.body = {
      status: 'success',
      json: jwt
    };
  },

}

// TODO(mikolaj6r): refactor
export async function isAuthenticated(ctx: Koa.Context, next: () => Promise<any>) {
  const { authorization } = ctx.req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      let token = authorization.split(' ');

      let decodedToken = await jwtServices.verify(token[1]);

      ctx.state.requester = decodedToken;
      await next();
    } catch (err) {
      console.log(err);
      ctx.status = 401;
    }
  } else {
    ctx.state.requester = undefined;
    //await next();

    //console.log('Authorization header is not found');
    ctx.status = 401;
    ctx.body = { message: 'Unauthorized' }
  }
}

export function isAuthorized(opts: { hasRole: Array<'admin' | 'teacher' | 'client' | 'public'>, allowSameUser?: boolean }) {
  return (ctx: Koa.Context, next: () => Promise<any>) => {
    const { data, type } = ctx.state.requester;
    const { id } = ctx.params

    if (type === 'user') {
      const { email, id: userId } = data;
      if (email === functions.config().rootuser.email)
        return next();

      if (opts.allowSameUser && id && userId === id)
        return next();
    }

    if (!data.role) {
      ctx.status = 403;
      ctx.body = '';
      return;
    }

    if (opts.hasRole.includes(data.role))
      return next();

    ctx.status = 403;
    ctx.body = '';
    return
  }
}