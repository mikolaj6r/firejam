import * as admin from "firebase-admin";
import * as cryptoServices from "./crypto";

import { CreateClient, UpdatedClient, DatabaseClient } from "../schemas/client";

const DB_COLLECTION_KEY = "clients";
const db = admin.firestore();

function mapClient(client: { id: string; data: DatabaseClient }) {
  return {
    id: client.id,
    data: {
      role: client.data.role,
      disabled: client.data.disabled,
    },
  };
}
export default {
  async find() {
    try {
      const snapshot = await db.collection(DB_COLLECTION_KEY).get();
      let resources: any[] = [];

      snapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      return resources.map(mapClient);
    } catch (error) {
      console.log("Error getting data from db", error);
      return [];
    }
  },

  async findOne(uid: string) {
    const ref = db.collection(DB_COLLECTION_KEY).doc(uid);
    const doc = await ref.get();

    if (!doc.exists) {
      console.log("No such document!");
      return null;
    } else {
      const client = {
        id: doc.id,
        data: doc.data() as DatabaseClient,
      };
      return mapClient(client);
    }
  },

  async update(uid: string, data: UpdatedClient) {
    console.log(data);
    const ref = db.collection(DB_COLLECTION_KEY).doc(uid);
    const res = await ref.update(data);

    return res;
  },

  async create(data: CreateClient) {
    const { token, ...restClient } = data;

    const hashedToken = cryptoServices.hash(token);

    const clientToStore = {
      ...restClient,
      token: hashedToken,
    };

    await db.collection(DB_COLLECTION_KEY).add(clientToStore);

    return true;
  },

  async delete(uid: string) {
    await db.collection(DB_COLLECTION_KEY).doc(uid).delete();
    return true;
  },
};
