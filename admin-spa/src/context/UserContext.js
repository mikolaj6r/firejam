import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        console.log(userAuth);
        const { email, displayName, uid } = userAuth;

        setUser({
          uid,
          email,
          displayName,
        });
      } else setUser(null);
    });

    return () => unsubscribe();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = useContext(UserContext);

  if (typeof user === "undefined") {
    throw new Error("useUser must be used within a UserContext");
  }

  return user;
}

export default UserContext;
