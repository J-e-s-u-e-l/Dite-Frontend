// "use client";

import React, { useEffect, useState } from "react";
import { postMessage } from "@/services/discussionHubServices";
import { fetchTracks } from "@/services/academyServices";
import { useToast } from "@/context/ToastContext";

interface PostMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onMessagePosted: (newMessage: any) => void;
  academyId: string;
}

const PostMessageModal: React.FC<PostMessageModalProps> = ({
  isOpen,
  onClose,
  // onMessagePosted,
  academyId,
}) => {
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  //   const [trackId, setTrackId] = useState("");
  const [tracksInAcademy, setTracksInAcademy] = useState<
    { trackId: string; trackName: string }[]
  >([]);
  // const [selectedTrack, setSelectedTrack] = useState<string | null>("");
  const [selectedTrack, setSelectedTrack] = useState("");
  //   const [academyId, setAcademyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTracks, setTracksLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const { showToast } = useToast();

  const fetchTracksInAcademy = async () => {
    setTracksLoading(true);
    try {
      const response = await fetchTracks(academyId);

      const fetchedTracks = response.data;
      setTracksInAcademy(fetchedTracks);
    } catch (error) {
      // showToast("Failed to fetch tracks. Please try again", "error");
      // setPageError(
      //   "Unable to load tracks due to a server issue. Please try again later or contact support if the problem persists."
      // );
      console.error("Error fetching tracks", error);
    } finally {
      setTracksLoading(false);
    }
  };
  useEffect(() => {
    fetchTracksInAcademy();
  }, [academyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: {
        messageTitle: string;
        messageBody: string;
        academyId: string;
        trackId?: string;
      } = {
        messageTitle,
        messageBody,
        academyId,
        // trackId: trackId || undefined,
      };
      if (selectedTrack != "") {
        payload.trackId = selectedTrack;
      }
      const response = await postMessage(payload);
      if (response.status) {
        showToast("Message posted successfully", "success");
        setMessageTitle("");
        setMessageBody("");
        setSelectedTrack("");
      }
      // await postMessage(payload);

      // onMessagePosted(newMessage);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Post a New Message
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="messageTitle"
            >
              Title
            </label>
            <input
              id="messageTitle"
              type="text"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Message Body */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="messageBody"
            >
              Message Body
            </label>
            <textarea
              id="messageBody"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          {/* Track Selection */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="trackId"
            >
              Track (Optional)
            </label>

            {loadingTracks ? (
              <div className="text-sm text-gray-500">Loading tracks...</div>
            ) : (
              <div>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">General</option>
                  {tracksInAcademy.map((track) => (
                    <option key={track.trackId} value={track.trackId}>
                      {track.trackName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="text-gray-600 font-medium p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white font-semibold py-2 px-6 rounded-md focus:outline-none hover:bg-blue-600 transition-all ${
                loading ? "opacity-50 cursor-wait" : ""
              }`}
            >
              {loading ? "Posting message..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostMessageModal;
