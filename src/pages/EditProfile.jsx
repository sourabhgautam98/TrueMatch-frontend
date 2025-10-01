import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";

const EditProfile = ({ user, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age: age ? Number(age) : "",
          gender,
          skills,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      setMessage(res.data.message);

      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }

    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setSkills(user.skills || []);
    }
  }, [user]);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-blue-300">Update your personal information</p>
          </div>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <div className="bg-gradient-to-br from-gray-800 to-blue-900/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-700/30 w-full">
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  className="w-full bg-gray-700/50 border border-blue-500/30 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  className="w-full bg-gray-700/50 border border-blue-500/30 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Photo URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  className="w-full bg-gray-700/50 border border-blue-500/30 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Enter your photo URL"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  className="w-full bg-gray-700/50 border border-blue-500/30 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-gray-700/50 border border-blue-500/30 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills.join(", ")}
                  className="w-full bg-gray-700/50 border border-blue-500/30 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    setSkills(e.target.value.split(",").map((skill) => skill.trim()))
                  }
                  placeholder="e.g. JavaScript, React, Node.js"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin -ml-1 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    "Save Profile"
                  )}
                </button>

                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Profile Preview */}
          <div className="bg-gradient-to-br from-gray-800 to-blue-900/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-700/30 w-full flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Preview</h2>

            <img
              alt="profile preview"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-500/30 shadow-lg mb-4"
              src={photoUrl || "/default-avatar.png"}
            />

            <h2 className="text-xl font-bold text-white mb-1">
              {capitalize(firstName)} {capitalize(lastName)}
            </h2>

            {(age || gender) && (
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {age && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 text-blue-200 text-sm">
                    {age} years
                  </span>
                )}
                {gender && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/50 text-purple-200 text-sm">
                    {capitalize(gender)}
                  </span>
                )}
              </div>
            )}

            <div className="w-full">
              <h3 className="font-semibold text-white mb-2">Skills</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) =>
                    skill.trim() ? (
                      <span
                        key={index}
                        className="border border-blue-400 rounded-full px-3 py-1 text-sm bg-blue-900/20 text-blue-200"
                      >
                        {capitalize(skill)}
                      </span>
                    ) : null
                  )
                ) : (
                  <p className="text-gray-400 italic text-sm">No skills listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default EditProfile;
