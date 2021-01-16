
//import * as Koa from 'koa'

import jwt from 'jsonwebtoken';

export default {
  getToken(ctx: any) {
    const params = Object.assign({}, ctx.request.body, ctx.request.query);

    let token = '';

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(' ');

      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        throw new Error(
          'Invalid authorization header format. Format is Authorization: Bearer [token]'
        );
      }
    } else if (params.token) {
      token = params.token;
    } else {
      throw new Error('No authorization header was found');
    }

    return this.verify(token);
  },

  issue(payload: any, jwtOptions = { }) {

    return jwt.sign(
      (payload.toJSON ? payload.toJSON() : payload),
      "sddada", //jwtSecret,
      jwtOptions
    );
  },

  verify(token: string) {
    return new Promise(function(resolve, reject) {
      jwt.verify(
        token,
        "sddada", //secret,
        {},
        function(err: unknown, tokenPayload = {}) {
          if (err) {
            return reject(new Error('Invalid token.'));
          }
          resolve(tokenPayload);
        }
      );
    });
  },
};