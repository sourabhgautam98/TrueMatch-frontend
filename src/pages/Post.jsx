import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns"; // ✅ for "2 hours ago"
import { BASE_URL } from "../utils/constants";
import CreatePost from "../components/CreatePost";
import { FaRegThumbsUp, FaRegCommentDots, FaShare } from "react-icons/fa";

// Capitalize first letter helper
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/post/allpost", { withCredentials: true });
      setPosts(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <CreatePost onPostCreated={fetchPosts} />

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-blue-200 text-lg">
              No posts yet. Be the first to create one!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gradient-to-br from-gray-800 to-blue-900/70 rounded-2xl p-5 shadow-xl border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300"
              >
                {/* 🔹 User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.userId?.photoUrl || "/default-avatar.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <p className="text-white font-semibold">
                      {capitalize(post.userId?.firstName)} {capitalize(post.userId?.lastName)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* 🔹 Post Text */}
                {post.description && (
                  <p className="text-white mb-4">{post.description}</p>
                )}

                {/* 🔹 Post Image */}
                {post.image && (
                  <div className="w-full">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full max-h-[300px] object-cover rounded-xl"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}

                {/* 🔹 Like / Comment / Share */}
                <div className="flex justify-around items-center mt-4 text-gray-300 border-t border-gray-700 pt-3">
                  <button className="flex items-center gap-2 hover:text-blue-400 transition">
                    <FaRegThumbsUp /> Like
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-400 transition">
                    <FaRegCommentDots /> Comment
                  </button>
                  <button className="flex items-center gap-2 hover:text-purple-400 transition">
                    <FaShare /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
