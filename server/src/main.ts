import Koa from 'koa';
import * as HttpStatus from 'http-status-codes';

import Router from 'koa-router';
import cors  from '@koa/cors';


import authRouter from './routes/auth'
import userRouter from './routes/users'

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import 'firebase-functions';

admin.initializeApp();

const PORT = Number(process.env.PORT) || 3001;

const app = new Koa();
app.use(cors());

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

async function firebaseAuthMiddleware(ctx: Koa.Context, next: () => Promise<any>) {
    const authorization = ctx.req.headers['authorization'];
    if (authorization) {
        try {
            let token = authorization.split(' ');
            let decodedToken = await admin.auth().verifyIdToken(token[1]);
            ctx.state.user = decodedToken;
            await next();
        } catch (err) {
            console.log(err);
            ctx.status = 401;
        }
    } else {
        ctx.state.user = undefined;
        await next();

        //console.log('Authorization header is not found');
        //ctx.status = 401;
    }
}

app.use(firebaseAuthMiddleware);

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