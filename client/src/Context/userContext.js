import { createContext, useContext, useEffect, useState } from "react";
import { decodeToken, isExpired } from "react-jwt";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSingleUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();
// make custom hook
export const useUser = () => {
  return useContext(UserContext);
};
const UserProvider = ({ children }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [user, setUser] = useState({});

  useEffect(() => {
    if (token) {
      if (isExpired(token)) {
        toast.error("Session Expired");
        localStorage.removeItem("token");
        return;
      }
      const decoded = decodeToken(token);
      const getData = async () => {
        const data = await dispatch(getSingleUser({ id: decoded?.id }));

        if (data.payload) {
          setUser(data.payload);
        }
      };
      getData();
    }
  }, [isAuthenticated, token]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
