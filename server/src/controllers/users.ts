import * as Koa from 'koa'
import * as admin from 'firebase-admin';


async function fetchAllUsers(nextPageToken?: string){
  try {
    const { users, /* pageToken */} = await admin.auth().listUsers(1000, nextPageToken);
    return users;
    /* 
    users.forEach((userRecord) => {
      console.log('user', userRecord.toJSON());
    });
    if (pageToken) {
      // List next batch of users.
      listAllUsers(listUsersResult.pageToken);
    } */
  }
  catch(error) {
      console.log('Error listing users:', error);
      return [];
  };
};



export default {
  async getAllUsers (ctx: Koa.Context) {
    console.log(ctx.state.user);

    if(ctx.state.user !== undefined) {
      const users = await fetchAllUsers();
      
      return ctx.body = {
        status: 'success',
        json: users
      };
    }
    else {
      console.log('Unauthorized user');
      ctx.status = 401;
      return ctx.body = {
        status: "error",
        text: "Unauthorized user"
      }
    }
  },
  async getUser (ctx: Koa.Context) {
    ctx.body = 'Hello World!';
  }
}
