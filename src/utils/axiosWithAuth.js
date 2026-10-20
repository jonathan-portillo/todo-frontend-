import axios from "axios";

export const axiosWithAuth = () => {
  const token = localStorage.getItem("token");

  return axios.create({
    headers: {
      Authorization: token,
    },
    // set REACT_APP_API_URL for a deployed build; local development uses port 4000
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/",
  });
};
