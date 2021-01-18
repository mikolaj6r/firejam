
//import * as Koa from 'koa'

import jwt from 'jsonwebtoken';

import NodeRSA from 'node-rsa';

import serviceAccount from "../service-account-key.json";

import fetch from 'node-fetch';

const publicKey = new NodeRSA().importKey(serviceAccount.private_key, "pkcs8-private-pem").exportKey("pkcs8-public-pem")


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
    return new Promise(async function(resolve, reject) {
      const [ header64, payload64 ] = token.split('.');

      const header = JSON.parse(Buffer.from(header64, 'base64').toString('utf8'));
      const payload = JSON.parse(Buffer.from(payload64, 'base64').toString('utf8'));

      if(Object.keys(payload).includes('firebase')){

        const publicKeys = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com').then(res => res.json());

        jwt.verify(
          token,
          publicKeys[header.kid],
          {
            algorithms: ["RS256"]
        },
          function(err: unknown, tokenPayload: any) {
            if (err) {
              return reject(new Error('Invalid token.'));
            }
            resolve({
              type: 'user',
              data: {
                role: tokenPayload.claims?.role,
                email: tokenPayload.email,
                email_verified: tokenPayload.email_verified,
                id: tokenPayload.user_id
              }
            });
          }
        );

      }
      else if(Object.keys(payload.claims).includes('firejam')){
        jwt.verify(
          token,
          publicKey,
          {
            algorithms: ["RS256"]
        },
          function(err: unknown, tokenPayload: any) {
            if (err) {
              return reject(new Error('Invalid token.'));
            }
            resolve({
              type: 'client',
              data: {
                role: tokenPayload.claims.role
              }
            });
          }
        );
      }

    });
  },
};