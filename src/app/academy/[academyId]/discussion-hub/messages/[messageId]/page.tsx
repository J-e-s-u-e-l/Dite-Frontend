"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  fetchMessageDetails,
  postResponseToMessage,
} from "@/services/discussionHubServices";
import { useToast } from "@/context/ToastContext";
import {
  // subscribeToMessageReplies,
  useSignalRStore,
  subscribeToMessageReplies,
} from "@/services/signalRServices";
import { MessageResponse, MessageDetails } from "@/types/interfaces";

// interface Response {
//   responseBody: string;
//   responderUsername: string;
//   responderRoleInAcademy: string;
//   sentAtAgo: string;
//   sentAt: string;
// }

const MessageDetailsPage: React.FC = () => {
  const { messageId } = useParams();

  const [messageDetails, setMessageDetails] = useState<MessageDetails | null>(
    null
  );
  const [allMessageResponses, setAllMessageResponses] = useState<
    MessageResponse[] | null
  >([]);

  const [newResponse, setNewResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const { showToast } = useToast();

  // const { connectMessageReplyHub, disconnectMessageReplyHub } =
  //   useSignalRStore();

  useEffect(() => {
    if (messageId) {
      fetchMessageDetailsFromServer(messageId as string);
    }
  }, [messageId]);

  const fetchMessageDetailsFromServer = async (messageId: string) => {
    try {
      setLoading(true);
      const response = await fetchMessageDetails(messageId);
      // setMessageDetails(response.data.message[0]);
      setMessageDetails(response.data.message[0]);
      setAllMessageResponses(response.data.responses);
    } catch (error) {
      console.error(error);
      setPageError("Failed to load message details. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!messageId) return;

    (async () => {
      await useSignalRStore.getState().connectMessageHub(); // Ensure connection is active
      await useSignalRStore.getState().joinGroup(messageId as string);

      subscribeToMessageReplies((newResponse) => {
        setAllMessageResponses((prev) => [
          newResponse as unknown as MessageResponse,
          ...(prev || []),
        ]);
      });
    })();

    return () => {
      useSignalRStore.getState().leaveGroup(messageId as string);
    };
  }, [messageId]);

  const handleResponseSubmit = async () => {
    if (!newResponse.trim()) return;

    try {
      setLoading(true);
      const response = await postResponseToMessage(
        messageId as string,
        newResponse
      );
      if (response.status) {
        showToast("Response submitted successfully", "success");
        setNewResponse("");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setPageError("Failed to submit response. Please try again.");
      setLoading(false);
    }
  };

  const handleReload = () => {
    setPageError("");
    fetchMessageDetailsFromServer(messageId as string);
  };

  if (pageError) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{pageError}</p>
        <button
          onClick={handleReload}
          className="mt-4 p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading) return <p>Loading message details...</p>;

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 min-h-screen">
      {/* Message Title */}
      <h2 className="text-3xl font-bold text-gray-900 border-b pb-2">
        {messageDetails?.messageTitle || "Undefined"}
      </h2>

      {/* Message Body */}
      <p className="mt-4 text-gray-800 text-lg leading-relaxed">
        {messageDetails?.messageBody || "Undefined"}
      </p>

      {/* Message Meta Info */}
      <div className="mt-4 text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
        <p>
          <span className="font-semibold">Track:</span>{" "}
          {messageDetails?.trackName || "General"}
        </p>
        <p>
          <span className="font-semibold">By:</span>{" "}
          {messageDetails?.senderUserName || "Undefined"}
          <i className="ml-1 text-gray-600">
            ({messageDetails?.senderRoleInAcademy || "Undefined"})
          </i>
        </p>
        <p>
          <span className="font-semibold">Sent at:</span>{" "}
          {messageDetails?.sentAtAgo || "Undefined"}
        </p>
      </div>

      {/* Response Input */}
      <div className="mt-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          rows={3}
          placeholder="Write your response..."
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
        />
        <button
          className="w-full mt-3 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleResponseSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Response"}
        </button>
      </div>

      {/* Responses Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Responses:</h3>
        {allMessageResponses && allMessageResponses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No responses yet.</p>
        ) : (
          <div className="space-y-4">
            {allMessageResponses &&
              [...allMessageResponses]
                .sort(
                  (a, b) =>
                    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
                )
                .map((response, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm border"
                  >
                    <p className="font-semibold text-gray-800">
                      {response.responderUsername}{" "}
                      <i className="text-gray-600">
                        ({response.responderRoleInAcademy})
                      </i>
                    </p>
                    <p className="text-gray-700 mt-2">
                      {response.responseBody}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {response.sentAtAgo}
                    </p>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDetailsPage;
