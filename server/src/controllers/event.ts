import * as Koa from "koa";
import eventServices from "../services/event";

import { Event, UpdatedEvent } from "../schemas/event";
import { DocumentID } from "../schemas/firebase";

export default {
  async find(ctx: Koa.Context) {
    const events = await eventServices.find();

    return (ctx.body = {
      status: "success",
      json: events,
    });
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const event = await eventServices.findOne(result.data);

    if (event == null) {
      return ctx.throw(404, "Event not found");
    }

    return (ctx.body = {
      status: "success",
      json: event,
    });
  },
  async update(ctx: any) {
    const id = ctx.params.id;
    const eventData = ctx.request.body;

    const result = UpdatedEvent.safeParse(eventData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const event = await eventServices.update(id, result.data);

    return (ctx.body = {
      status: "success",
      json: event,
    });
  },
  async create(ctx: any) {
    const eventData = ctx.request.body;
    const { id: userId } = ctx.state.requester.data;

    const result = Event.safeParse(eventData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const event = await eventServices.create(result.data, userId);

    return (ctx.body = {
      status: "success",
      json: event,
    });
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const status = await eventServices.delete(result.data);

    return (ctx.body = {
      status: "success",
      json: { status },
    });
  },
};
