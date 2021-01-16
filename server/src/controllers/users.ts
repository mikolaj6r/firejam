import * as Koa from 'koa'
import userServices from '../services/user';

export default {
  async getAllUsers (ctx: Koa.Context) {
    if(ctx.state.user !== undefined) {
      const users = await userServices.fetchAllUsers();
      
      return ctx.body = {
        status: 'success',
        json: users
      };
    }
    else {
      ctx.status = 401;
      return ctx.body = {
        status: "error",
        text: "Unauthorized user"
      }
    }
  },
  async getUser (ctx: Koa.Context) {
    const id = ctx.params.id;

    if(ctx.state.user !== undefined) {
      const user = await userServices.fetchUser(id);
      return ctx.body = {
        status: 'success',
        json: user
      };
    }
    else {
      ctx.status = 401;
      return ctx.body = {
        status: "error",
        text: "Unauthorized user"
      }
    }
  },
  async updateUser (ctx: any) {
    const id = ctx.params.id;
    const userData = ctx.request.body;

    if(ctx.state.user !== undefined) {
      const user = await userServices.updateUser(id, userData);
      return ctx.body = {
        status: 'success',
        json: user
      };
    }
    else {
      ctx.status = 401;
      return ctx.body = {
        status: "error",
        text: "Unauthorized user"
      }
    }
  },
  async createUser(ctx: any){
    const userData = ctx.request.body;

    if(ctx.state.user !== undefined) {
      const user = await userServices.createUser(userData);
      console.log(user)
      return ctx.body = {
        status: 'success',
        json: user
      };
    }
    else {
      ctx.status = 401;
      return ctx.body = {
        status: "error",
        text: "Unauthorized user"
      }
    }
  },
  async deleteUser(ctx: Koa.Context) {
    const id = ctx.params.id;

    if(ctx.state.user !== undefined) {
      const status = await userServices.deleteUser(id);
      return ctx.body = {
        status: 'success',
        json: {status}
      };
    }
    else {
      ctx.status = 401;
      return ctx.body = {
        status: "error",
        text: "Unauthorized user"
      }
    }
  }
}
