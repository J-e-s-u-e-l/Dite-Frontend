// "use client";

import React, { useEffect, useState } from "react";
import { postMessage } from "@/services/messageServices";
import { fetchTracks } from "@/services/academyServices";

interface PostMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessagePosted: (newMessage: any) => void;
  academyId: string;
}

const PostMessageModal = (React.FC<PostMessageModalProps> = ({
  isOpen,
  onClose,
  onMessagePosted,
  academyId,
}) => {
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  //   const [trackId, setTrackId] = useState("");
  const [tracks, setTracks] = useState<
    { trackId: string; trackName: string }[]
  >([]);
  //   const [academyId, setAcademyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTracks, setTracksLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const fetchTracksInAcademy = async () => {
    setTracksLoading(true);
    try {
      const fetchedTracks = await fetchTracks(academyId);
      setTracks(fetchedTracks);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newMessage = await postMessage({
        messageTitle,
        messageBody,
        academyId,
        trackId: trackId || undefined,
      });

      onMessagePosted(newMessage);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Post a New Message</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb4">
            <label
              className="block text-sm fon-medium mb-2"
              htmlFor="messageTitle"
            >
              Title
            </label>
            <input
              id="messageTitle"
              type="text"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>
          <div className="mb4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="messageBody"
            >
              Message Body
            </label>
            <textarea
              id="messageBody"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              className="border border-gray-500 rounded-md p-2 w-full"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="trackId">
              Track (Optional)
            </label>
            <input
              id="trackId"
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 text-gray-500"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button>{loading ? "Posting message..." : "Post"}</button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default PostMessageModal;
