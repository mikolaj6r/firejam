import * as admin from 'firebase-admin';

const DB_COLLECTION_KEY = 'posts';
const db = admin.firestore();

export default {
  async find() {
    try {
      const snapshot = await db.collection(DB_COLLECTION_KEY).get();
      let resources: any[] = [];

      snapshot.forEach(doc => {
        resources.push({
          id: doc.id,
          data: doc.data()
        })
      });

      return resources;
    }
    catch (error) {
      console.log('Error getting data from db', error);
      return [];
    };
  },

  async findOne(uid: string) {
    const ref = db.collection(DB_COLLECTION_KEY).doc(uid);
    const doc = await ref.get();

    if (!doc.exists) {
      console.log('No such document!');
      return {};
    } else {
      return {
        id: doc.id,
        data: doc.data()
      }
    }
  },

  async update(uid: string, data: any) {
    const ref = db.collection(DB_COLLECTION_KEY).doc(uid);
    const res = await ref.update(data);

    return res;
  },

  async create(data: any) {
    await db.collection(DB_COLLECTION_KEY).add(data);

    return true;
  },

  async delete(uid: string) {
    await db.collection(DB_COLLECTION_KEY).doc(uid).delete();
    return true;
  }
}