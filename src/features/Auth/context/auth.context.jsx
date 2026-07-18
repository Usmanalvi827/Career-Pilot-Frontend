import React, { createContext, useEffect, useState } from "react";
import { getMe } from "../services/auth.api";

export let AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let [users, setUsers] = useState(null);
  let [loading, setLoading] = useState();
  const [authLoading, setAuthLoading] = useState(true);


 useEffect(() => {
  const getAndSetUser = async () => {
    try {
      const res = await getMe();

      if (res) {
        setUsers(res.users);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  getAndSetUser();
}, []);
  return (
    <>
      <AuthContext.Provider
        value={{
          users,
          setUsers,
          loading,
          setLoading,
          authLoading
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
