import React from "react";
import { useRouter } from "next/navigation";

interface MessageCardProps {
  message: {
    messageId: string;
    messageTitle: string;
    messageBody: string;
    senderUserName: string;
    senderRoleInAcademy: string;
    trackName?: string;
    sentAtAgo: string;
    sentAt: string;
    totalNumberOfResponses: number;
  };
  academyId: string | string[] | undefined;
}

const MAX_MESSAGE_LENGTH = 70;
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const MessageCard: React.FC<MessageCardProps> = ({ message, academyId }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(
      `/academy/${academyId}/discussion-hub/messages/${message.messageId}/`
    );
  };

  return (
    <div
      className="border p-4 rounded-md shadow-md mb-4 bg-white cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="text-xl font-semibold text-gray-900">
        {message.messageTitle}
      </h3>
      {/* <p className="text-gray-700 mt-2">{message.messageBody}</p> */}
      <p className="text-gray-700 mt-2">
        {truncateText(message.messageBody, MAX_MESSAGE_LENGTH)}
      </p>

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
            {message.senderUserName} <i>({message.senderRoleInAcademy})</i>
          </span>
        </span>
        <span>• {message.sentAtAgo}</span>
        <span className="ml-auto font-semibold text-blue-600">
          {message.totalNumberOfResponses === 1
            ? `${message.totalNumberOfResponses} Response`
            : `${message.totalNumberOfResponses} Responses`}
        </span>
      </div>
    </div>
  );
};

export default MessageCard;
