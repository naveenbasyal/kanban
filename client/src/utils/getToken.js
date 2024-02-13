import { decodeToken, isExpired } from "react-jwt";

export const getToken = () => {
  const token = localStorage.getItem("token");
  
  if (!token) return null;

  if (isExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }

  return token;
};
