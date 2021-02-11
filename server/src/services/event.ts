import * as admin from "firebase-admin";
import { Event, UpdatedEvent } from "../schemas/event";
import { FirebaseDoc } from "../schemas/firebase";

import userServices from "../services/user";

const DB_COLLECTION_KEY = "events";
const db = admin.firestore();

type Resource = FirebaseDoc<Event>;

export default {
  async find(): Promise<Resource[]> {
    try {
      const snapshot = await db.collection(DB_COLLECTION_KEY).get();
      let resources: Resource[] = [];

      snapshot.forEach(async (doc) => {
        resources.push({
          id: doc.id,
          data: doc.data() as Event,
        });
      });

      const promises = resources.map(async (resource) => {
        const user = await userServices.findOne(resource.data.userId);
        return {
          ...resource,
          data: {
            ...resource.data,
            user,
          },
        };
      });

      const resourcesWithUser = await Promise.all(promises);
      return resourcesWithUser;
    } catch (error) {
      console.log("Error getting data from db", error);
      return [];
    }
  },

  async findOne(uid: string): Promise<Resource | null> {
    const ref = db.collection(DB_COLLECTION_KEY).doc(uid);
    const doc = await ref.get();

    if (!doc.exists) {
      console.log("No such document!");
      return null;
    } else {
      return {
        id: doc.id,
        data: doc.data() as Event,
      };
    }
  },

  async update(uid: string, data: UpdatedEvent) {
    const ref = db.collection(DB_COLLECTION_KEY).doc(uid);
    const res = await ref.update(data);

    return res;
  },

  async create(data: Event, userId: string) {
    await db.collection(DB_COLLECTION_KEY).add({
      ...data,
      userId,
    });

    return true;
  },

  async delete(uid: string) {
    await db.collection(DB_COLLECTION_KEY).doc(uid).delete();
    return true;
  },
};
