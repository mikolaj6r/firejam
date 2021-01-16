import * as Koa from 'koa'
import clientServices from '../services/clients';

export default {
  async find(ctx: Koa.Context) {
    const clients = await clientServices.find();

    return ctx.body = {
      status: 'success',
      json: clients
    };
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const client = await clientServices.findOne(id);
    
    return ctx.body = {
      status: 'success',
      json: client
    };
  },
  async update(ctx: any) {
    const id = ctx.params.id;
    const clientData = ctx.request.body;

    const client = await clientServices.update(id, clientData);
    
    return ctx.body = {
      status: 'success',
      json: client
    };
  },
  async create(ctx: any) {
    const clientData = ctx.request.body;

    const client = await clientServices.create(clientData);
    
    return ctx.body = {
      status: 'success',
      json: client
    };
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const status = await clientServices.delete(id);
    
    return ctx.body = {
      status: 'success',
      json: { status }
    };

  }
}
