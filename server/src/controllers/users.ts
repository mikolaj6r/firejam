import * as Koa from 'koa'
import userServices from '../services/user';

export default {
  async getAllUsers(ctx: Koa.Context) {
    const users = await userServices.find();

    return ctx.body = {
      status: 'success',
      json: users
    };
  },
  async getUser(ctx: Koa.Context) {
    const id = ctx.params.id;

    const user = await userServices.findOne(id);
    
    return ctx.body = {
      status: 'success',
      json: user
    };
  },
  async updateUser(ctx: any) {
    const id = ctx.params.id;
    const userData = ctx.request.body;

    const user = await userServices.update(id, userData);
    
    return ctx.body = {
      status: 'success',
      json: user
    };
  },
  async createUser(ctx: any) {
    const userData = ctx.request.body;

    const user = await userServices.create(userData);
    
    return ctx.body = {
      status: 'success',
      json: user
    };
  },
  async deleteUser(ctx: Koa.Context) {
    const id = ctx.params.id;

    const status = await userServices.delete(id);
    
    return ctx.body = {
      status: 'success',
      json: { status }
    };

  }
}
