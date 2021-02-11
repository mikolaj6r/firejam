import * as Koa from "koa";
import postServices from "../services/post";

import { Post, UpdatedPost } from "../schemas/post";
import { DocumentID } from "../schemas/firebase";

export default {
  async find(ctx: Koa.Context) {
    const posts = await postServices.find();

    return (ctx.body = {
      status: "success",
      json: posts,
    });
  },
  async findOne(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const post = await postServices.findOne(result.data);

    if (post == null) {
      return ctx.throw(404, "Post not found");
    }

    return (ctx.body = {
      status: "success",
      json: post,
    });
  },
  async update(ctx: any) {
    const id = ctx.params.id;
    const postData = ctx.request.body;

    const result = UpdatedPost.safeParse(postData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const post = await postServices.update(id, result.data);

    return (ctx.body = {
      status: "success",
      json: post,
    });
  },
  async create(ctx: any) {
    const postData = ctx.request.body;

    const { id: userId } = ctx.state.requester.data;

    const result = Post.safeParse(postData);
    if (!result.success) {
      return ctx.throw(400, `Bad request body(${result.error.message})`);
    }

    const post = await postServices.create(result.data, userId);

    return (ctx.body = {
      status: "success",
      json: post,
    });
  },
  async delete(ctx: Koa.Context) {
    const id = ctx.params.id;

    const result = DocumentID.safeParse(id);
    if (!result.success) {
      return ctx.throw(400, "Bad id param");
    }

    const status = await postServices.delete(result.data);

    return (ctx.body = {
      status: "success",
      json: { status },
    });
  },
};
