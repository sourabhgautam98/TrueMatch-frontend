import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";

const UserCard = ({ user, onActionComplete }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, skills } = user;
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleSendRequest = async (status, userId) => {
    try {
      setProcessing(true);
      setActionType(status);
      const token = Cookies.get("token");
      await axios.post(
        `${BASE_URL}/requests/send/${status}/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      dispatch(removeUserFromFeed(userId));
      if (onActionComplete) onActionComplete(userId);
    } catch (err) {
      console.error("Request failed", err);
    } finally {
      setProcessing(false);
      setActionType(null);
    }
  };

  const formattedSkills =
    typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : Array.isArray(skills)
        ? skills
        : [];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-blue-900/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={photoUrl}
            alt={firstName}
            className="w-36 h-36 rounded-2xl object-cover border-4 border-blue-500/30 shadow-lg"
          />
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-white mb-2">
            {firstName} {lastName}
          </h2>
          {(age || gender) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {age && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 text-blue-200 text-sm">
                  {age} yrs
                </span>
              )}
              {gender && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/50 text-purple-200 text-sm">
                  {gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()}
                </span>
              )}
            </div>
          )}
          {formattedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formattedSkills.slice(0, 6).map((skill, i) => (
                <span
                  key={i}
                  className="border border-blue-400 rounded-full px-3 py-1 text-sm bg-blue-900/20 text-blue-200"
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}
                </span>
              ))}
              {formattedSkills.length > 6 && (
                <span className="border border-blue-400 rounded-full px-3 py-1 text-sm bg-blue-900/20 text-blue-200">
                  +{formattedSkills.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={() => handleSendRequest("ignored", _id)}
          disabled={processing}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ${processing && actionType === "ignored"
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gray-700 hover:bg-gray-800 text-white"
            }`}
        >
          {processing && actionType === "ignored" ? "Processing..." : "Ignore"}
        </button>
        <button
          onClick={() => handleSendRequest("interested", _id)}
          disabled={processing}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ${processing && actionType === "interested"
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {processing && actionType === "interested" ? "Sending..." : "Interested"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
