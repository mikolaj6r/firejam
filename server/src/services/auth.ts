import * as admin from "firebase-admin";

import * as cryptoServices from "./crypto";

const DB_COLLECTION_KEY = "clients";
const db = admin.firestore();

export default {
  async createJWTToken(token: string) {
    let foundClient: any = null;

    try {
      const snapshot = await db.collection(DB_COLLECTION_KEY).get();
      let alreadyFound = false;

      snapshot.forEach((doc) => {
        if (alreadyFound) return;

        const data = doc.data();
        const tokenObj = data.token;
        console.log(tokenObj);
        const isThatClient = cryptoServices.compare(token, tokenObj);
        console.log(isThatClient);
        if (isThatClient) {
          foundClient = {
            id: doc.id,
            role: data.role || "client",
          };
          alreadyFound = true;
        }
      });
    } catch (error) {
      console.log("Error getting data from db", error);
      throw new Error("Error getting data from db");
    }

    console.log(foundClient);
    if (!foundClient) return null;

    try {
      const jwtToken = await admin
        .auth()
        .createCustomToken(foundClient.id, { ...foundClient, firejam: true });

      return jwtToken;
    } catch (error) {
      console.log("Error creating custom token:", error);
      return "";
    }
  },
};
