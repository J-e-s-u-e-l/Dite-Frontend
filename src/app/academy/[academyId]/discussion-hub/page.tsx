"use client";

import React from "react";
import { fetchMessages } from "@/services/discussionHubServices";
import {
  startSignalRConnection,
  subscribeToMessages,
} from "@/services/signalRServices";
import MessageCard from "@/components/feature/academy/MessageCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import Loader from "@/components/common/Loader";
import PostMessageModal from "@/components/feature/academy/PostMessageModal";

const DiscussionHubPage: React.FC = () => {
  // const [messages, setMessages] = React.useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { academyId } = useParams();
  const { showToast } = useToast();

  // Fetch messages on initial load

  const fetchInitialMessages = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetchMessages(academyId, pageNumber);
      setMessages(response);
    } catch (error) {
      showToast("Failed to fetch messages. Please try again", "error");
      setPageError(
        "Unable to load messages due to a server issue. Please try again later or contact support if the problem persists."
      );
      console.error("Error fetching messages", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInitialMessages(1);
  }, [academyId]);

  // Connect to SignalR hub and subscribe to messages
  // useEffect(() => {
  //   startSignalRConnection();
  //   subscribeToMessages((newMessage) => {
  //     setMessages((prev) => [newMessage, ...prev]);
  //   });
  // }, []);

  startSignalRConnection();
  subscribeToMessages((newMessage) => {
    setMessages((prev) => [newMessage, ...prev]);
  });

  useEffect(() => {
    startSignalRConnection();
  }, []);

  const handleReload = () => {
    setPageError("");
    fetchInitialMessages(1);
    startSignalRConnection();
  };

  const handleNewMessage = (newMessage: any) => {
    setMessages((prev) => [newMessage, ...prev]);
  };

  const handlePageChange = async (pageNumber: number) => {
    fetchInitialMessages(pageNumber);
  };

  if (loading) {
    return <Loader />;
  }
  // if (pageError) return <div>Error: {pageError}</div>;

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discussion Hub</h2>
      </div>
      {messages.length === 0 ? (
        <div>No messages yet. Start the discussion!</div>
      ) : (
        messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md fixed bottom-20 right-10"
        onClick={() => setModalOpen(true)}
      >
        Post Message
      </button>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <span>{pageNumber}</span>
        <button onClick={() => handlePageChange(pageNumber + 1)}>Next</button>
      </div>
      <PostMessageModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onMessagePosted={handleNewMessage}
        academyId={academyId}
      />
    </div>
  );
};

export default DiscussionHubPage;
