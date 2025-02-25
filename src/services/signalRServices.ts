import * as SignalR from "@microsoft/signalr";
import { create } from "zustand";

interface SignalRStore {
  messageHubConnection: SignalR.HubConnection | null;
  notificationHubConnection: SignalR.HubConnection | null;
  connectMessageHub: (
    academyId: string
  ) => Promise<SignalR.HubConnection | null>;
  disconnectMessageHub: (academyId: string) => Promise<void>;
  connectMessageReplyHub: (
    messageId: string
  ) => Promise<SignalR.HubConnection | null>;
  disconnectMessageReplyHub: (messageId: string) => Promise<void>;
}

// ✅ Extracted Reusable Connection Logic
const connectHub = async (
  hubName: "messageHubConnection" | "notificationHubConnection",
  hubUrl: string
): Promise<SignalR.HubConnection | null> => {
  let connection = useSignalRStore.getState()[hubName];

  if (!connection) {
    connection = new SignalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    useSignalRStore.setState({ [hubName]: connection });

    connection.onreconnecting(() => console.log("Reconnecting..."));
    connection.onreconnected(() => console.log("Reconnected."));
    connection.onclose(() => console.log("Disconnected."));
  }

  if (connection.state === SignalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      console.log(`Connected to ${hubUrl}`);
      return connection;
    } catch (error) {
      console.error(`Error connecting to ${hubUrl}`, error);
      return null;
    }
  }

  return connection;
};

export const useSignalRStore = create<SignalRStore>((set, get) => ({
  messageHubConnection: null,
  notificationHubConnection: null,

  // ✅ Reused `connectHub` for Message Hub
  connectMessageHub: async (academyId) => {
    const connection = await connectHub(
      "messageHubConnection",
      `${process.env.NEXT_PUBLIC_API_URL}/message-hub`
    );

    if (connection) {
      // Ensure connection is fully established before invoking
      if (connection.state !== SignalR.HubConnectionState.Connected) {
        await new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (connection.state === SignalR.HubConnectionState.Connected) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }

      // Now it's safe to invoke JoinAcademyGroup
      await connection.invoke("JoinAcademyGroup", academyId);
      console.log(`Joined academy group: ${academyId}`);
    }

    return connection;
  },

  disconnectMessageHub: async (academyId) => {
    const connection = get().messageHubConnection;
    if (connection?.state === SignalR.HubConnectionState.Connected) {
      await connection.invoke("LeaveAcademyGroup", academyId);
      console.log(`Left academy group: ${academyId}`);

      await connection.stop(); // Ensure the connection stops
      useSignalRStore.setState({ messageHubConnection: null });
    }
  },

  // ✅ Reused `connectHub` for Message Reply Hub
  connectMessageReplyHub: async (messageId) => {
    const connection = await connectHub(
      "messageHubConnection",
      `${process.env.NEXT_PUBLIC_API_URL}/message-hub`
    );
    if (connection) {
      await connection.invoke("JoinMessageGroup", messageId);
      console.log(`Joined message group: ${messageId}`);
    }
    return connection;
  },

  disconnectMessageReplyHub: async (messageId) => {
    const connection = get().messageHubConnection;
    if (connection?.state === SignalR.HubConnectionState.Connected) {
      await connection.invoke("LeaveMessageGroup", messageId);
      console.log(`Left message group: ${messageId}`);
    }
  },
}));

// ✅ Unified Subscription Logic
const subscribeToEvent = <T>(
  eventName: string,
  callback: (data: T) => void
) => {
  const connection = useSignalRStore.getState().messageHubConnection;
  if (!connection) {
    console.error(
      `Cannot subscribe to ${eventName}, connection is not initialized.`
    );
    return;
  }

  if (connection.state !== SignalR.HubConnectionState.Connected) {
    console.error(
      `Cannot subscribe to ${eventName}, connection is not in Connected state.`
    );
    return;
  }

  connection.off(eventName);
  connection.on(eventName, callback);
};

// ✅ Subscribes to new messages
export const subscribeToDiscussionHubMessages = (
  callback: (message: { id: string; content: string; sender: string }) => void
) => {
  subscribeToEvent<{ id: string; content: string; sender: string }>(
    "ReceiveMessage",
    callback
  );
};

// ✅ Subscribes to new replies
export const subscribeToMessageReplies = (
  callback: (messageReply: {
    ResponseId: string;
    ResponseBody: string;
    ResponderUsername: string;
    ResponderRoleInAcademy: string;
    SentAtAgo: string;
    SentAt: string;
  }) => void
) => {
  subscribeToEvent<{
    ResponseId: string;
    ResponseBody: string;
    ResponderUsername: string;
    ResponderRoleInAcademy: string;
    SentAtAgo: string;
    SentAt: string;
  }>("ReceiveReply", callback);
};
