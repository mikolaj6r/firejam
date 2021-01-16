import Koa from 'koa';

import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions';

import authServices from '../services/auth';


export default {
  async find(ctx: Koa.Context) {
    const users = await authServices.find();

    return ctx.body = {
      status: 'success',
      json: users
    };
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const user = await authServices.findOne(id);
    
    return ctx.body = {
      status: 'success',
      json: user
    };
  },
  async update(ctx: any) {
    const id = ctx.params.id;
    const userData = ctx.request.body;

    const user = await authServices.update(id, userData);
    
    return ctx.body = {
      status: 'success',
      json: user
    };
  },
  async create(ctx: any) {
    const userData = ctx.request.body;

    const user = await authServices.create(userData);
    
    return ctx.body = {
      status: 'success',
      json: user
    };
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const status = await authServices.delete(id);
    
    return ctx.body = {
      status: 'success',
      json: { status }
    };

  }
}

// TODO(mikolaj6r): refactor
export async function isAuthenticated(ctx: Koa.Context, next: () => Promise<any>) {
  const {authorization} = ctx.req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      let token = authorization.split(' ');
      let decodedToken = await admin.auth().verifyIdToken(token[1]);
      ctx.state.user = decodedToken;
      await next();
    } catch (err) {
      ctx.status = 401;
    }
  } else {
    ctx.state.user = undefined;
    //await next();

    //console.log('Authorization header is not found');
    ctx.status = 401;
    ctx.body = { message: 'Unauthorized' }
  }
}

export function isAuthorized(opts: { hasRole: Array<'admin' | 'teacher' | 'client'>, allowSameUser?: boolean }) {
  return (ctx: Koa.Context, next: () => Promise<any>) => {
    const { role, email, uid } = ctx.state.user;
    const { id } = ctx.params

    if (email === functions.config().rootuser.email)
      return next();

    if (opts.allowSameUser && id && uid === id)
      return next();

    if (!role) {
      ctx.status = 403;
      ctx.body = '';
      return;
    }

    if (opts.hasRole.includes(role))
      return next();

    ctx.status = 403;
    ctx.body = '';
    return
  }
}