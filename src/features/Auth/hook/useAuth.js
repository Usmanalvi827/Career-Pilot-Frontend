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

    // FIX: the backend already logs the new user in (sets the auth
    // cookie) at the moment of registration. Before, this function never
    // updated the auth context, so the app didn't "know" the user was
    // logged in until a manual page refresh triggered getMe(). Now we
    // update it immediately, same as handleLogin does.
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
