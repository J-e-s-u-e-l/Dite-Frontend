import React from "react";

interface MessageCardProps {
  message: {
    messageTitle: string;
    messageBody: string;
    senderUsername: string;
    senderRoleInAcademy: string;
    trackName?: string;
    sentAt: string;
  };
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => (
  <div className="border p-4 rounded-md shadow-md mb-4">
    <h3 className="text-xl font-semibold">{message.messageTitle}</h3>
    <p className="text-gray-700">{message.messageBody}</p>
    <div className="text-sm text-gray-500 mt-2">
      <span>
        Track: {message.trackName || "General"} |{" "}
        <span>By: {message.senderUsername}</span> |{" "}
        <span>{new Date(message.sentAt).toLocaleString()}</span>
      </span>
    </div>
  </div>
);

export default MessageCard;
