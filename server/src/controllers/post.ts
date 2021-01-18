import * as Koa from 'koa'
import postServices from '../services/post';

export default {
  async find(ctx: Koa.Context) {
    const posts = await postServices.find();

    return ctx.body = {
      status: 'success',
      json: posts
    };
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const post = await postServices.findOne(id);
    
    return ctx.body = {
      status: 'success',
      json: post
    };
  },
  async update(ctx: any) {
    const id = ctx.params.id;
    const postData = ctx.request.body;

    const post = await postServices.update(id, postData);
    
    return ctx.body = {
      status: 'success',
      json: post
    };
  },
  async create(ctx: any) {
    const postData = ctx.request.body;

    const post = await postServices.create(postData);
    
    return ctx.body = {
      status: 'success',
      json: post
    };
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const status = await postServices.delete(id);
    
    return ctx.body = {
      status: 'success',
      json: { status }
    };

  }
}
