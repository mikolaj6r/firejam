import * as admin from 'firebase-admin';

const DB_COLLECTION_KEY = 'clients';
const db = admin.firestore();

interface IClient {
  token: string;
  role: string
}

export default {
  async createJWTToken(token: string) {
    const snapshot = await db.collection(DB_COLLECTION_KEY).where('token', '==', token).limit(1).get();

    if (snapshot.empty) {
      console.log('No matching client.');
      return;
    }

    const foundClient = snapshot.docs[0].data() as IClient;
    const role = foundClient.role || 'admin';

    try {
      const jwtToken = await admin.auth().createCustomToken(token, { role, firejam: true });
      return jwtToken;
    }
    catch(error){
      console.log('Error creating custom token:', error);
      return '';
    }
  }
}