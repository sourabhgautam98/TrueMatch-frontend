import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../utils/constants";

const CreatePost = ({ onPostCreated }) => {
  const user = useSelector((store) => store.user);
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [error, setError] = useState("");

  const createPost = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Post text is required");
      return;
    }

    setCreatingPost(true);
    setError("");

    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        BASE_URL + "/post/create",
        {
          description: description.trim(),
          image: url.trim() || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setDescription("");
      setUrl("");

      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.error || "Failed to create post");
    } finally {
      setCreatingPost(false);
    }
  };

  const cancelPost = () => {
    setDescription("");
    setUrl("");
    setError("");
  };

  return (
    <form
      onSubmit={createPost}
      className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-700/30"
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
          <img
            src={user?.photoUrl || "/default-avatar.png"}
            alt="user avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-lg font-semibold text-white mb-2">
            {user
              ? `Something on your mind, ${user.firstName
                ? user.firstName.charAt(0).toUpperCase() +
                user.firstName.slice(1).toLowerCase()
                : ""
              }?`
              : "Create Post"}
          </h2>

          {/* Error */}
          {error && (
            <div className="mb-3 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Post text */}
          <textarea
            placeholder="What's on your mind?"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError("");
            }}
            className="block w-full mb-3 p-3 rounded-lg text-white bg-gray-900/50 border border-gray-700 resize-none focus:outline-none focus:border-blue-500"
            rows="3"
            disabled={creatingPost}
          />

          {/* Image URL field (only appears if user typed text) */}
          {description.trim() && (
            <input
              type="url"
              placeholder="Image URL"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              className="block w-full mb-4 p-3 rounded-lg text-white bg-gray-900/50 border border-gray-700 focus:outline-none focus:border-blue-500"
              disabled={creatingPost}
            />
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            {(description.trim() || url.trim()) && (
              <button
                type="button"
                onClick={cancelPost}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-5 rounded-xl transition-all duration-300"
                disabled={creatingPost}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={!description.trim() || creatingPost}
              className={`px-5 py-2 rounded-lg transition ${!description.trim() || creatingPost
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
            >
              {creatingPost ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePost;
