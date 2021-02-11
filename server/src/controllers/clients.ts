import * as Koa from "koa";
import clientServices from "../services/clients";

import { CreateClient, UpdatedClient } from "../schemas/client";
import { DocumentID } from "../schemas/firebase";

export default {
  async find(ctx: Koa.Context) {
    const clients = await clientServices.find();

    return (ctx.body = {
      status: "success",
      json: clients,
    });
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const client = await clientServices.findOne(result.data);

    if (client == null) {
      return ctx.throw(404, "Client not found");
    }
    return (ctx.body = {
      status: "success",
      json: client,
    });
  },
  async update(ctx: Koa.Context) {
    const id = ctx.params.id;
    const clientData = ctx.request.body;

    const result = UpdatedClient.safeParse(clientData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const client = await clientServices.update(id, result.data);

    return (ctx.body = {
      status: "success",
      json: client,
    });
  },
  async create(ctx: Koa.Context) {
    const clientData = ctx.request.body;

    const result = CreateClient.safeParse(clientData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const client = await clientServices.create(result.data);

    return (ctx.body = {
      status: "success",
      json: client,
    });
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const status = await clientServices.delete(id);

    return (ctx.body = {
      status: "success",
      json: { status },
    });
  },
};
