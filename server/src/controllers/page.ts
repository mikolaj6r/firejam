import * as Koa from "koa";
import pageServices from "../services/page";

import { Page, UpdatedPage } from "../schemas/page";
import { DocumentID } from "../schemas/firebase";

export default {
  async find(ctx: Koa.Context) {
    const pages = await pageServices.find();

    return (ctx.body = {
      status: "success",
      json: pages,
    });
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const page = await pageServices.findOne(result.data);

    if (page == null) {
      return ctx.throw(404, "Page not found");
    }

    return (ctx.body = {
      status: "success",
      json: page,
    });
  },
  async update(ctx: Koa.Context) {
    const id = ctx.params.id;
    const pageData = ctx.request.body;

    const result = UpdatedPage.safeParse(pageData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const page = await pageServices.update(id, result.data);

    return (ctx.body = {
      status: "success",
      json: page,
    });
  },
  async create(ctx: Koa.Context) {
    const pageData = ctx.request.body;
    const { id: userId } = ctx.state.requester.data;

    const result = Page.safeParse(pageData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const page = await pageServices.create(result.data, userId);

    return (ctx.body = {
      status: "success",
      json: page,
    });
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const status = await pageServices.delete(result.data);

    return (ctx.body = {
      status: "success",
      json: { status },
    });
  },
};
