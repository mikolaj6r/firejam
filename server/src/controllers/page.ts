import * as Koa from "koa";
import pageServices from "../services/page";

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

    const page = await pageServices.findOne(id);

    return (ctx.body = {
      status: "success",
      json: page,
    });
  },
  async update(ctx: any) {
    const id = ctx.params.id;
    const pageData = ctx.request.body;

    const page = await pageServices.update(id, pageData);

    return (ctx.body = {
      status: "success",
      json: page,
    });
  },
  async create(ctx: any) {
    const pageData = ctx.request.body;
    const { id: userId } = ctx.state.requester.data;

    const page = await pageServices.create(pageData, userId);

    return (ctx.body = {
      status: "success",
      json: page,
    });
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const status = await pageServices.delete(id);

    return (ctx.body = {
      status: "success",
      json: { status },
    });
  },
};
