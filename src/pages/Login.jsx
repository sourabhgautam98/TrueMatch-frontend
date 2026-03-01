import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/auth/login", {
        emailId,
        password,
      });

      if (res.status === 200) {
        Cookies.set("token", res.data.token);
        const token = Cookies.get("token");
        const profileRes = await axios.get(`${BASE_URL}/profile/view`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        dispatch(addUser(profileRes.data));
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/auth/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        const profileRes = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });

        dispatch(addUser(profileRes.data));
        navigate("/profile");
      }
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-10 px-4">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-800 to-blue-900/70 shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {isLoginForm ? "Welcome Back 👋" : "Create Your Account ✨"}
        </h2>

        <div className="space-y-4">
          {!isLoginForm && (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full rounded-xl bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full rounded-xl bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              value={emailId}
              placeholder="abc@example.com"
              onChange={(e) => setEmailId(e.target.value)}
              className="input input-bordered w-full rounded-xl bg-gray-800 text-white placeholder-gray-400 border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full rounded-xl bg-gray-800 text-white placeholder-gray-400 border-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <HiOutlineEyeOff size={24} />
                ) : (
                  <HiOutlineEye size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <button
          className="btn btn-primary w-full mt-6 rounded-xl"
          onClick={isLoginForm ? handleLogin : handleSignUp}
        >
          {isLoginForm ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-sm text-center mt-5 text-gray-300 cursor-pointer hover:text-blue-400 transition"
          onClick={() => setIsLoginForm((value) => !value)}
        >
          {isLoginForm
            ? "New here? Create an account"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
