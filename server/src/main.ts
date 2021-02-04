import Koa from "koa";
import * as HttpStatus from "http-status-codes";

import Router from "koa-router";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import "firebase-functions";

//import serviceAccount from "./service-account-key.json";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import clientsRouter from "./routes/clients";
import pagesRouter from "./routes/page";
import eventsRouter from "./routes/event";
import postsRouter from "./routes/post";

const PORT = Number(process.env.PORT) || 3001;

const app = new Koa();
app.use(cors());
app.use(bodyParser());

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  await next();
});
// Middleware
// Error handling
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    ctx.status =
      error.statusCode ||
      error.status ||
      HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit("error", error, ctx);
  }
});

//routing
const router = new Router();
router.get("/", async (ctx) => {
  ctx.body = "Hello World!";
});

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());
app.use(clientsRouter.routes());
app.use(clientsRouter.allowedMethods());
app.use(pagesRouter.routes());
app.use(pagesRouter.allowedMethods());
app.use(eventsRouter.routes());
app.use(eventsRouter.allowedMethods());
app.use(postsRouter.routes());
app.use(postsRouter.allowedMethods());
app.use(router.routes());

app.listen(PORT);

console.log(`Server running on port ${PORT}`);

// Application error logging.
app.on("error", console.error);

export const firejamApi = functions.https.onRequest(app.callback());
