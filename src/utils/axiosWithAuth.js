import axios from "axios";

export const axiosWithAuth = () => {
  const token = localStorage.getItem("token");

  const instance = axios.create({
    headers: {
      Authorization: token,
    },
    // set REACT_APP_API_URL for a deployed build; local development uses port 4000
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/",
  });

  // an expired or invalid token: sign out and go to the login page.
  // /auth routes are skipped because they use 401 for wrong passwords.
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const url = err.config?.url || "";
      if (err.response?.status === 401 && !url.includes("auth/") && token) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        window.location.assign("/login");
      }
      return Promise.reject(err);
    }
  );

  return instance;
};
