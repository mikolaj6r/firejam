import * as Koa from "koa";
import userServices from "../services/user";

import { DocumentID } from "../schemas/firebase";
import { CreatedUser } from "../schemas/user";

export default {
  async find(ctx: Koa.Context) {
    const users = await userServices.find();

    return (ctx.body = {
      status: "success",
      json: users,
    });
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const user = await userServices.findOne(result.data);

    if (user == null) {
      return ctx.throw(404, "User not found");
    }
    return (ctx.body = {
      status: "success",
      json: user,
    });
  },
  async update(ctx: any) {
    const id = ctx.params.id;
    const userData = ctx.request.body;

    const user = await userServices.update(id, userData);

    return (ctx.body = {
      status: "success",
      json: user,
    });
  },
  async create(ctx: any) {
    const userData = ctx.request.body;

    const result = CreatedUser.safeParse(userData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const user = await userServices.create(result.data);

    return (ctx.body = {
      status: "success",
      json: user,
    });
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const status = await userServices.delete(result.data);

    return (ctx.body = {
      status: "success",
      json: { status },
    });
  },
};
