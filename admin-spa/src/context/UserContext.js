import React, { createContext, useState, useEffect } from "react";
import { auth, generateUserDocument } from '../firebase'

const UserContext = createContext(null);

export function UserProvider({children}){
const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async userAuth => {
      console.log({userAuth})

      const userData = await generateUserDocument(userAuth);
      setUser(userData);
    });

    return () => ( unsubscribe() );
  }, [])

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;