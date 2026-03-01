import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavBar from "../components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const token = Cookies.get("token");
      if (!token) {
        // No token — only redirect if not on home page
        if (location.pathname !== "/") {
          navigate("/login");
        }
        return;
      }
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
        Cookies.remove("token");
        if (location.pathname !== "/") {
          navigate("/login");
        }
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};
export default Body;
