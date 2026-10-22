import { useEffect, useState } from "react";

const CHANGE_EVENT = "auth-change";

// The login token carries the username, so read it from there.
export const getUsername = () => {
  try {
    const payload = localStorage.getItem("token")?.split(".")[1];
    if (!payload) return "";
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).username || "";
  } catch (e) {
    return "";
  }
};

// call after the token changes, so anything showing the username updates
export const notifyAuthChange = () =>
  window.dispatchEvent(new Event(CHANGE_EVENT));

export const useUsername = () => {
  const [username, setUsername] = useState(getUsername);

  useEffect(() => {
    const update = () => setUsername(getUsername());
    window.addEventListener(CHANGE_EVENT, update);
    return () => window.removeEventListener(CHANGE_EVENT, update);
  }, []);

  return username;
};
