import React from "react";

interface MessageCardProps {
  message: {
    messageTitle: string;
    messageBody: string;
    senderUserName: string;
    senderRoleInAcademy: string;
    trackName?: string;
    sentAt: string;
  };
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => (
  <div className="border p-4 rounded-md shadow-md mb-4 bg-white">
    <h3 className="text-xl font-semibold text-gray-900">
      {message.messageTitle}
    </h3>
    <p className="text-gray-700 mt-2">{message.messageBody}</p>

    <div className="text-sm text-gray-500 mt-3 flex items-center space-x-2">
      <span>
        Track:{" "}
        {message.trackName ? (
          <span className="font-medium">{message.trackName}</span>
        ) : (
          <span className="italic text-gray-400">General</span>
        )}
      </span>
      <span>
        • By:{" "}
        <span className="font-medium text-gray-900">
          {message.senderUserName} (<i>{message.senderRoleInAcademy}</i>)
        </span>
      </span>
      <span>• {message.sentAt}</span>
    </div>
  </div>
);

export default MessageCard;
