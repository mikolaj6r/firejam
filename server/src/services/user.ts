import * as admin from 'firebase-admin';

export default {
  async fetchAllUsers(nextPageToken?: string) {
    try {
      const { users } = await admin.auth().listUsers(1000, nextPageToken);
      return users;
    }
    catch (error) {
      console.log('Error listing users:', error);
      return [];
    };
  },
  async fetchUser(uid: string) {
    const user = await admin.auth().getUser(uid);
    return user;
  },
  async updateUser(uid: string, userData: any) {
    const user = await admin.auth().updateUser(uid, userData)
    return user;
  },
  async createUser(userData: any) {
    console.log(userData);
    const user = await admin.auth().createUser(userData);
    return user;
  },
  async deleteUser(uid: string) {
    await admin.auth().deleteUser(uid)
    return true;
  }
}