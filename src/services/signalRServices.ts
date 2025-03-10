import * as SignalR from "@microsoft/signalr";
import { create } from "zustand";

interface SignalRStore {
  messageHubConnection: SignalR.HubConnection | null;
  connectMessageHub: () => Promise<void>;
  disconnectMessageHub: () => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
}

const HUB_URL = `${process.env.NEXT_PUBLIC_API_URL}/message-hub`;

export const useSignalRStore = create<SignalRStore>((set, get) => ({
  messageHubConnection: null,

  connectMessageHub: async () => {
    let connection = get().messageHubConnection;

    if (!connection) {
      connection = new SignalR.HubConnectionBuilder()
        .withUrl(HUB_URL)
        .withAutomaticReconnect()
        .build();

      set({ messageHubConnection: connection });

      connection.onreconnecting(() => console.log("Reconnecting..."));
      connection.onreconnected(() => console.log("Reconnected..."));
      connection.onclose(() => console.log("Disconnected..."));
    }

    if (connection.state === SignalR.HubConnectionState.Disconnected) {
      try {
        await connection?.start();
        console.log("Connected to SignalR Hub");
      } catch (error) {
        console.error("Error connecting to SignalR Hub", error);
      }
    }
  },

  disconnectMessageHub: async () => {
    const connection = get().messageHubConnection;
    if (connection?.state === SignalR.HubConnectionState.Connected) {
      await connection.stop();
      console.log("SignalR Hub Disconnected");
      set({ messageHubConnection: null });
    }
  },

  joinGroup: async (groupId: string) => {
    const connection = get().messageHubConnection;
    if (connection?.state === SignalR.HubConnectionState.Connected) {
      await connection?.invoke("JoinGroup", groupId);
      console.log(`Joined group: ${groupId}`);
    }
  },

  leaveGroup: async (groupId: string) => {
    const connection = get().messageHubConnection;
    if (connection?.state === SignalR.HubConnectionState.Connected) {
      await connection?.invoke("LeaveGroup", groupId);
      console.log(`Left group: ${groupId}`);
    }
  },
}));

// Subscribe to incoming messages & replies
const subscribeToEvent = <T>(
  eventName: string,
  callback: (data: T) => void
) => {
  const connection = useSignalRStore.getState().messageHubConnection;
  if (
    !connection ||
    connection.state !== SignalR.HubConnectionState.Connected
  ) {
    // console.error(`Cannot subscribe to ${eventName}, connection not ready.`);
    return;
  }

  connection.off(eventName); // Remove previous listeners to avoid duplication
  connection.on(eventName, callback);
};

// Subscribe to discussion messages
export const subscribeToDiscussionHubMessages = (
  callback: (message: { id: string; content: string; sender: string }) => void
) => {
  subscribeToEvent("ReceiveMessage", callback);
};

// Subscribe to message replies
export const subscribeToMessageReplies = (
  callback: (reply: {
    ResponseId: string;
    ResponseBody: string;
    ResponderUsername: string;
    ResponderRoleInAcademy: string;
    SentAtAgo: string;
    SentAt: string;
  }) => void
) => {
  subscribeToEvent("ReceiveReply", callback);
};
