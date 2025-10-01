import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/auth/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-gray-900 text-white shadow-md px-6">
      {/* Brand */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-2xl font-bold tracking-wide"
        >
          👩‍💻 TrueMatch
        </Link>
      </div>

      {/* User Section */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-lg font-medium">
            Welcome, <span className="text-white-400">{user.firstName}</span>
          </span>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-white-100 ring-offset-2 ring-offset-gray-900">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-52 rounded-xl bg-gray-800 text-white p-2 shadow-xl border border-gray-700"
            >
              <li>
                <Link
                  to="/profile"
                  className="flex justify-between hover:bg-gray-700 rounded-lg px-3 py-2"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/feed"
                  className="flex justify-between hover:bg-gray-700 rounded-lg px-3 py-2"
                >
                  Find Friends
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="flex justify-between hover:bg-gray-700 rounded-lg px-3 py-2"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="flex justify-between hover:bg-gray-700 rounded-lg px-3 py-2"
                >
                  Requests
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left hover:bg-gray-700 rounded-lg px-3 py-2"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white shadow-md"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
