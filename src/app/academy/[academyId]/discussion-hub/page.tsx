"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import Loader from "@/components/common/Loader";
import PostMessageModal from "@/components/feature/academy/PostMessageModal";
import MessageCard from "@/components/feature/academy/MessageCard";
import { fetchMessages } from "@/services/discussionHubServices";
import {
  //   startSignalRConnectionForMessages,
  subscribeToDiscussionHubMessages,
  useSignalRStore,
  //   cleanupDiscussionHubSubscription,
} from "@/services/signalRServices";

const DiscussionHubPage: React.FC = () => {
  // const [messages, setMessages] = React.useState<any[]>([]);
  const [messages, setMessages] = useState<any[] | null>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [remainingMessagesCount, setRemainingMessagesCount] = useState(0);
  const { connectMessageHub, disconnectMessageHub } = useSignalRStore();

  const { academyId } = useParams();
  const { showToast } = useToast();

  useEffect(() => {
    fetchInitialMessages(1);
  }, [academyId]);

  const fetchInitialMessages = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetchMessages(academyId, pageNumber);
      setMessages(response.data.messages);
      setRemainingMessagesCount(response.data.remainingMessagesCount);
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

  // useEffect(() => {
  //   if (!academyId) return;

  //   connectMessageHub(academyId as string);
  //   subscribeToDiscussionHubMessages((newMessage) => {
  //     setMessages((prev) => [newMessage, ...prev]);
  //   });

  //   return () => {
  //     disconnectMessageHub(academyId as string);
  //   };
  // }, [academyId]);

  useEffect(() => {
    if (!academyId) return;

    let isMounted = true; // To avoid memory leaks

    (async () => {
      const connection = await connectMessageHub(academyId as string);

      if (connection && isMounted) {
        subscribeToDiscussionHubMessages((newMessage) => {
          setMessages((prev) => [newMessage, ...prev]);
        });
      }
    })();

    return () => {
      isMounted = false;
      disconnectMessageHub(academyId as string);
    };
  }, [academyId]);

  // useEffect(() => {
  //   if (!academyId) return;

  //   startSignalRConnectionForMessages(academyId);
  //   subscribeToDiscussionHubMessages((newMessage) => {
  //     setMessages((prev) => [newMessage, ...prev]);
  //   });

  //   return () => {
  //     cleanupDiscussionHubSubscription(academyId);
  //   };
  // }, [academyId, router.asPath]);

  const handleReload = () => {
    setPageError("");
    fetchInitialMessages(1);
    // startSignalRConnectionForMessages(academyId);
  };

  const handlePageChange = async (pageNumber: number) => {
    fetchInitialMessages(pageNumber);
  };

  if (loading) {
    return <Loader />;
  }

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
    <div className="p-6 bg-grey-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discussion Hub</h2>
      </div>
      {messages && messages.length > 0 ? (
        [...messages]
          .sort(
            (a, b) =>
              new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
          )
          .map((message, index) => (
            <MessageCard key={index} message={message} academyId={academyId} />
          ))
      ) : (
        <div>No messages yet. Start the discussion!</div>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md fixed bottom-20 right-10"
        onClick={() => setModalOpen(true)}
      >
        Post Message
      </button>

      {/* Pagination Controls */}
      <div className="pagination mt-4 flex items-center justify-center space-x-4">
        <button
          onClick={() => {
            handlePageChange(pageNumber - 1);
            setPageNumber(pageNumber - 1);
          }}
          disabled={pageNumber <= 1}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            pageNumber <= 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold text-gray-700">
          {pageNumber}
        </span>
        <button
          onClick={() => {
            handlePageChange(pageNumber + 1);
            setPageNumber(pageNumber + 1);
          }}
          className={`px-4 py-2 text-white rounded-md font-medium ${
            remainingMessagesCount <= 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={remainingMessagesCount <= 0}
        >
          Next
        </button>
      </div>

      <PostMessageModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        // onMessagePosted={handleNewMessage}
        academyId={academyId}
      />
    </div>
  );
};

export default DiscussionHubPage;
