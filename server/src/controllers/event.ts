import * as Koa from 'koa'
import eventServices from '../services/event';

export default {
  async find(ctx: Koa.Context) {
    const events = await eventServices.find();

    return ctx.body = {
      status: 'success',
      json: events
    };
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const event = await eventServices.findOne(id);
    
    return ctx.body = {
      status: 'success',
      json: event
    };
  },
  async update(ctx: any) {
    const id = ctx.params.id;
    const eventData = ctx.request.body;

    const event = await eventServices.update(id, eventData);
    
    return ctx.body = {
      status: 'success',
      json: event
    };
  },
  async create(ctx: any) {
    const eventData = ctx.request.body;
    const { id: userId } = ctx.state.requester.data;

    const event = await eventServices.create(eventData, userId);
    
    return ctx.body = {
      status: 'success',
      json: event
    };
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const status = await eventServices.delete(id);
    
    return ctx.body = {
      status: 'success',
      json: { status }
    };

  }
}
