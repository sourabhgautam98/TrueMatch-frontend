import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import Cookies from "js-cookie";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const getFeed = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const res = await axios.get(`${BASE_URL}/users/feed`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data || []));
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleActionComplete = (userId) => {
    dispatch(removeUserFromFeed(userId));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const filteredFeed = feed
    ? feed.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!feed || feed.length <= 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <h1 className="text-white text-2xl font-bold text-center">
          TrueMatch – Find Friends
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-6 px-4 sm:px-6 lg:px-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-6">
        Find Friends
      </h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg w-full max-w-md text-white font-bold placeholder-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
        {filteredFeed.length > 0 ? (
          filteredFeed
            .slice(0, visibleCount)
            .map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onActionComplete={() => handleActionComplete(user._id)}
              />
            ))
        ) : searchTerm.trim() !== "" ? (
          <div className="text-center text-white text-xl mt-12">
            User not found
          </div>
        ) : null}
      </div>
      {visibleCount < filteredFeed.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="
              px-8 py-4
              bg-blue-600 hover:bg-blue-700
              rounded-lg
              text-white font-semibold
              text-lg
              sm:text-xl
              transition-all duration-300
            "
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
