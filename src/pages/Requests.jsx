import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [processingId, setProcessingId] = useState(null);

  const reviewRequest = async (status, _id) => {
    try {
      setProcessingId(_id);
      const token = Cookies.get("token");
      await axios.post(
        BASE_URL + "/requests/review/" + status + "/" + _id,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(BASE_URL + "/users/requests/received", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (requests.length === 0)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <div className="bg-gradient-to-br from-purple-900 to-blue-800 p-8 rounded-3xl shadow-2xl max-w-md w-full">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Connection Requests</h2>
          <p className="text-blue-200">When someone sends you a connection request, it will appear here.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Connection Requests</h1>
          <p className="text-blue-300">People who want to connect with you</p>
        </div>

        <div className="space-y-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;

            return (
              <div
                key={_id}
                className="bg-gradient-to-br from-gray-800 to-blue-900/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 relative">
                    <div className="relative">
                      <img
                        alt="profile"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-500/30 shadow-lg"
                        src={photoUrl || '/default-avatar.png'}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {firstName + " " + lastName}
                    </h2>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                      {age && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 text-blue-200 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {age} years
                        </span>
                      )}

                      {gender && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/50 text-purple-200 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {gender}
                        </span>
                      )}
                    </div>

                    {about && (
                      <div className="mb-4">
                        <p className="text-gray-300 italic">"{about}"</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center w-full md:w-auto">
                    <button
                      className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 ${processingId === request._id
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                        }`}
                      onClick={() => reviewRequest("rejected", request._id)}
                      disabled={processingId === request._id}
                    >
                      {processingId === request._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </>
                      )}
                    </button>

                    <button
                      className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 ${processingId === request._id
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                        }`}
                      onClick={() => reviewRequest("accepted", request._id)}
                      disabled={processingId === request._id}
                    >
                      {processingId === request._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Requests;