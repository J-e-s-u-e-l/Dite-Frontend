import * as SignalR from "@microsoft/signalr";
import { AnyARecord } from "node:dns";
import { create } from "zustand";

interface SignalRStore {
  messageHubConnection: SignalR.HubConnection | null;
  notificationHubConnection: SignalR.HubConnection | null;
  connectMessageHub: (academyId: string) => Promise<any | null>;
  disconnectMessageHub: (academyId: string) => Promise<void>;
  connectMessageReplyHub: (messageId: string) => Promise<void>;
  disconnectMessageReplyHub: (messageId: string) => Promise<void>;
}

export const useSignalRStore = create<SignalRStore>((set, get) => ({
  messageHubConnection: null,
  notificationHubConnection: null,

  connectMessageHub: async (academyId) => {
    let connection = get().messageHubConnection;

    if (!connection) {
      connection = new SignalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/message-hub`)
        .withAutomaticReconnect()
        .build();

      set({ messageHubConnection: connection });

      connection.onreconnecting(() => console.log("Reconnecting..."));
      connection.onreconnected(() => console.log("Reconnected."));
      connection.onclose(() => console.log("Disconnected."));
    }

    if (connection.state === SignalR.HubConnectionState.Disconnected) {
      try {
        await connection.start();
        console.log(
          `Message hub connection established for academy ${academyId}`
        );

        if (connection.state === SignalR.HubConnectionState.Connected) {
          await connection.invoke("JoinAcademyGroup", academyId);
          console.log(`Joined academy group: ${academyId}`);
        }

        return connection; // Return connection after fully established
      } catch (error) {
        console.error("Error while establishing connection", error);
        return null;
      }
    } else {
      console.log("Connection is already established.");
      return connection;
    }
  },

  disconnectMessageHub: async (academyId) => {
    const connection = get().messageHubConnection;
    if (connection?.state === SignalR.HubConnectionState.Connected) {
      await connection.invoke("LeaveAcademyGroup", academyId);
      console.log(`Left academy group: ${academyId}`);
    }
  },

  connectMessageReplyHub: async (messageId) => {
    let connection = get().messageHubConnection;

    if (!connection) {
      connection = new SignalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/message-hub`)
        .withAutomaticReconnect()
        .build();

      set({ messageHubConnection: connection });

      connection.onreconnecting(() => console.log("Reconnecting..."));
      connection.onreconnected(() => console.log("Reconnected."));
      connection.onclose(() => console.log("Disconnected."));
    }

    if (connection.state === SignalR.HubConnectionState.Disconnected) {
      try {
        await connection.start();
        console.log(
          `Message hub connection established for message ${messageId}`
        );
      } catch (error) {
        console.error("Error while establishing connection", error);
        return;
      }
    }

    try {
      await connection.invoke("JoinMessageGroup", messageId);
      console.log(`Joined message group: ${messageId}`);
    } catch (error) {
      console.error("Failed to join message group", error);
    }
  },

  disconnectMessageReplyHub: async (messageId) => {
    const connection = get().messageHubConnection;
    if (connection?.state === SignalR.HubConnectionState.Connected) {
      await connection.invoke("LeaveMessageGroup", messageId);
      console.log(`Left message group: ${messageId}`);
    }
  },

  //   let connection = get().notificationHubConnection;

  //   if (!connection) {
  //     connection = new SignalR.HubConnectionBuilder()
  //       .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notification-hub`, {
  //         headers: { Authorization: `Bearer ${getCookie("authToken")}` },
  //       })
  //       .withAutomaticReconnect()
  //       .build();

  //     set({ notificationHubConnection: connection });

  //     connection.onreconnecting(() => console.log("Reconnecting..."));
  //     connection.onreconnected(() => console.log("Reconnected."));
  //     connection.onclose(() => console.log("Disconnected."));
  //   }

  //   if (connection.state === SignalR.HubConnectionState.Disconnected) {
  //     await connection.start();
  //     console.log("Notification hub connected.");
  //   }
  // },

  // disconnectNotificationHub: () => {
  //   const connection = get().notificationHubConnection;
  //   if (connection?.state === SignalR.HubConnectionState.Connected) {
  //     connection.stop();
  //     console.log("Notification hub disconnected.");
  //   }
  // },
}));

export const subscribeToDiscussionHubMessages = (
  callback: (message: any) => void
) => {
  const messageHubConnection = useSignalRStore.getState().messageHubConnection;

  if (!messageHubConnection) {
    console.error("Message hub connection is not initialized.");
    return;
  }

  messageHubConnection.off("ReceiveMessage");
  messageHubConnection.on("ReceiveMessage", (message) => {
    callback(message);
  });
};

export const subscribeToMessageReplies = (
  callback: (messageReply: any) => void
) => {
  const messageHubConnection = useSignalRStore.getState().messageHubConnection;

  if (!messageHubConnection) {
    console.error("Message hub connection is not initialized.");
    return;
  }

  messageHubConnection.off("ReceiveReply");
  messageHubConnection.on("ReceiveReply", (messageReply) => {
    callback(messageReply);
  });
};
