import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import Cookies from "js-cookie";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // user for modal

  const fetchConnections = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(BASE_URL + "/users/connections", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!connections || connections.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col justify-center items-center text-center px-4">
        <div className="bg-gradient-to-br from-purple-900 to-blue-800 p-8 rounded-3xl shadow-2xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-2">No Connections Yet</h2>
          <p className="text-blue-200">
            Your connections will appear here once you start connecting with others.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Your Connections</h1>

        <ul className="space-y-4">
          {connections.map((connection) => {
            if (!connection || typeof connection !== "object") return null;
            const { _id, firstName, lastName, photoUrl, age, gender } = connection;

            return (
              <li
                key={_id}
                className="flex items-center gap-4 bg-gray-800/70 hover:bg-gray-700/70 p-3 rounded-lg border border-blue-700/30 transition"
              >
                <div className="relative">
                  <img
                    src={photoUrl || "/default-avatar.png"}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-gray-900"></span>
                </div>

                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {firstName} {lastName}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {age ? `${age} yrs` : ""} {age && gender ? "•" : ""}{" "}
                    {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : ""}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(connection)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl border border-blue-700/30 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={selectedUser.photoUrl || "/default-avatar.png"}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 mb-4"
              />
              <p className="text-white font-bold text-xl mb-1">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <p className="text-gray-400 text-sm mb-3">
                {selectedUser.age ? `${selectedUser.age} yrs` : ""}{" "}
                {selectedUser.age && selectedUser.gender ? "•" : ""}{" "}
                {selectedUser.gender
                  ? selectedUser.gender.charAt(0).toUpperCase() +
                  selectedUser.gender.slice(1)
                  : ""}
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {selectedUser.skills && selectedUser.skills.length > 0 ? (
                  selectedUser.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="border border-blue-400 rounded-full px-3 py-1 text-sm bg-blue-900/20 text-blue-200"
                    >
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">No skills listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
