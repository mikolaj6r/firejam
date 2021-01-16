import Koa from 'koa';
import * as HttpStatus from 'http-status-codes';

import Router from 'koa-router';
import cors  from '@koa/cors';
import bodyParser from 'koa-bodyparser'

import authRouter from './routes/auth'
import userRouter from './routes/users'

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import 'firebase-functions';

admin.initializeApp();

const PORT = Number(process.env.PORT) || 3001;

const app = new Koa();
app.use(cors());
app.use(bodyParser());

// Middleware
// Error handling
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch (error) {
        console.log(error);
        ctx.status = error.statusCode || error.status || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit('error', error, ctx);
    }
});

//routing
const router = new Router();
router.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
});

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(router.routes());

app.listen(PORT);

console.log(`Server running on port ${PORT}`);

// Application error logging.
app.on('error', console.error);

export const firejamApi = functions.https.onRequest(app.callback());