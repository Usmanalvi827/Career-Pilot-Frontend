import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function register({
  firstname,
  lastname,
  username,
  email,
  password,
}) {
  try {
    const response = await api.post("/api/auth/signUp", {
      firstname,
      lastname,
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    // console.log(response)

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const response = await api.get("http://localhost:3000/api/auth/logout");

    return response;
  } catch (error) {
    throw error;
  }
}

export async function getMe() {
  try {
    const response = await api.get("http://localhost:3000/api/auth/get-me");

    return response.data;
  } catch (error) {
    throw error;
  }
}
