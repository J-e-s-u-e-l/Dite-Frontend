import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  fetchMessageDetails,
  postResponseToMessage,
} from "@/services/discussionHubServices";
import { useToast } from "@/context/ToastContext";

interface Response {
  responderUsername: string;
  responderRole: string;
  responseMessage: string;
  sentAt: string;
}

interface MessageDetails {
  messageTitle: string;
  messageBody: string;
  senderUserName: string;
  senderRoleInAcademy: string;
  trackName?: string;
  sentAt: string;
  totalNumberOfResponses: number;
  responses: Response[];
}

const MessageDetailsPage = () => {
  const { messageId } = useParams();

  const [messageDetails, setMessageDetails] = useState<MessageDetails | null>(
    null
  );
  const [newResponse, setNewResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    if (messageId) {
      fetchMessageDetailsFromServer(messageId as string);
    }
  }, [messageId]);

  const fetchMessageDetailsFromServer = async (messageId: string) => {
    try {
      setLoading(true);
      const response = await fetchMessageDetails(messageId);
      setMessageDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setPageError("Failed to load message details. Please try again.");
      setLoading(false);
    }
  };

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

  if (!messageDetails) return <p>Loading messages...</p>;

  return (
    <div className="max-w-2x1 mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2x1 font-bold">{messageDetails.messageTitle}</h2>
      <p className="mt-2 text-gray-700">{messageDetails.messageBody}</p>

      <div className="text-sm text-gray-500 mt-4">
        <p>Track: {messageDetails.trackName || "General"}</p>
        <p>
          By: {messageDetails.senderUserName} (
          <i>{messageDetails.senderRoleInAcademy}</i>)
        </p>
        <p>Sent at: {messageDetails.sentAt}</p>
        <p>Total Responses: {messageDetails.totalNumberOfResponses}</p>
      </div>

      {/* <div className="mt-6">
        <textarea className="w-full p-2 border rounded" rows={3} placeholder="Write your response..." value={newResponse} onChange={(e) => setNewResponse(e.target.value)} /> */}
      <div className="mt-6">
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Write your response..."
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
          onClick={handleResponseSubmit}
          disabled={loading}
        >
          {loading ? "Submitting" : "Submit Response"}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Responses:</h3>
        {messageDetails.responses.length === 0 ? (
          <p className="text-gray-500">No responses yet.</p>
        ) : (
          messageDetails.responses.map((response, index) => (
            <div key={index} className="border-t mt-4 pt-2">
              <p className="font-medium">
                {response.responderUsername} (<i>{response.responderRole}</i>)
              </p>
              <p className="text-gray-700">{response.responseMessage}</p>
              <p className="text-xs text-gray-500">{response.sentAt}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageDetailsPage;
