import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { login, register } from "../services/auth.api";

export function useAuth() {
  const {
    users,
    setUsers,
    loading,
    setLoading,
    authLoading, // ✅ add this
  } = useContext(AuthContext);

  const handleLogin = async ({ email, password }) => {
    const data = await login({ email, password });
    setUsers(data.user);
    return data;
  };

  const handleRegister = async ({
    firstname,
    lastname,
    username,
    email,
    password,
  }) => {
    const data = await register({
      firstname,
      lastname,
      username,
      email,
      password,
    });

  
    setUsers(data.user);

    return data;
  };

 return {
  users,
  setUsers,
  loading,
  setLoading,
  authLoading,
  handleLogin,
  handleRegister,
};
}
