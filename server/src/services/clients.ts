import * as admin from 'firebase-admin';

const DB_COLLECTION_KEY = 'clients';
const db = admin.firestore();

export default {
  async find() {
    try {
      const snapshot = await db.collection(DB_COLLECTION_KEY).get();
      let clients: any[] = [];

      snapshot.forEach(doc => {
        clients.push({
          id: doc.id,
          data: doc.data()
        })
      });

      return clients;
    }
    catch (error) {
      console.log('Error getting clients', error);
      return [];
    };
  },

  async findOne(uid: string) {
    const clientRef = db.collection(DB_COLLECTION_KEY).doc(uid);
    const doc = await clientRef.get();

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

  async update(uid: string, clientData: any) {
    const clientRef = db.collection(DB_COLLECTION_KEY).doc(uid);
    const res = await clientRef.update(clientData);

    return res;
  },

  async create(clientData: any) {
    await db.collection(DB_COLLECTION_KEY).add(clientData);

    return true;
  },

  async delete(uid: string) {
    await db.collection(DB_COLLECTION_KEY).doc(uid).delete();
    return true;
  }
}