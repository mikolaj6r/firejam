import * as admin from "firebase-admin";
import { CreatedUser } from "../schemas/user";

function mapUser(user: admin.auth.UserRecord) {
  const customClaims = (user.customClaims || { role: "teacher" }) as {
    role?: string;
  };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
    emailVerified: user.emailVerified,
  };
}

export default {
  async find(nextPageToken?: string) {
    try {
      const { users } = await admin.auth().listUsers(1000, nextPageToken);
      return users.map(mapUser);
    } catch (error) {
      console.log("Error listing users:", error);
      return [];
    }
  },
  async findOne(uid: string) {
    const user = await admin.auth().getUser(uid);

    if (!user) return null;

    return mapUser(user);
  },
  async update(uid: string, { role, ...userData }: { role: string }) {
    await admin.auth().updateUser(uid, userData);
    await admin.auth().setCustomUserClaims(uid, { role });
    const user = await admin.auth().getUser(uid);

    return mapUser(user);
  },
  async create({ role = "public", ...userData }: CreatedUser) {
    const userDataWithDefaults = {
      disabled: true,
      emailVerified: true,
      ...userData,
    };

    console.log(userData);
    console.log(userDataWithDefaults);
    const user = await admin.auth().createUser(userDataWithDefaults);

    await admin.auth().setCustomUserClaims(user.uid, { role });

    return user;
  },
  async delete(uid: string) {
    await admin.auth().deleteUser(uid);
    return true;
  },
};
