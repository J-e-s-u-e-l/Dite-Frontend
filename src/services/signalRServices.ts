import * as SignalR from "@microsoft/signalr";
import { getCookie } from "@/utils/apiClient";

// const messageHubConnection = new SignalR.HubConnectionBuilder()
//   .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/message-hub`, {
//     accessTokenFactory: () => localStorage.getItem("token") || "",
//   })
//   .withAutomaticReconnect()
//   .build();
const messageHubConnection = new SignalR.HubConnectionBuilder()
  .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/message-hub`)
  .withAutomaticReconnect()
  .build();

const notificationHubConnection = new SignalR.HubConnectionBuilder()
  .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notification-hub`, {
    headers: {
      Authorization: `Bearer ${getCookie("authToken")}`,
    },
  })
  .withAutomaticReconnect()
  .build();
// const notificationHubConnection = new SignalR.HubConnectionBuilder()
//   .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notification-hub`)
//   .withAutomaticReconnect()
//   .build();

export const startHubConnection = async (connection, hubName) => {
  try {
    // if (connection.state === "Disconnected") {
    if (connection.state === SignalR.HubConnectionState.Disconnected) {
      await connection.start();
      console.log(`${hubName} connection established`);
    } else {
      console.log(`${hubName} connection is already active`);
    }

    connection.onreconnecting(() => {
      console.log(`${hubName} connection lost. Attempting to reconnect...`);
    });

    connection.onreconnected(() => {
      console.log(`${hubName} connection successfully reestablished.`);
    });
  } catch (error) {
    console.error(`Error while starting ${hubName} connection`, error);
  }
};

// MESSAGE SERVICES
export const startSignalRConnectionForMessages = async (
  academyId: string | string[] | undefined
) => {
  await startHubConnection(messageHubConnection, "Message Hub");

  // Wait for the connection to be in the "Connected" state before invoking JoinAcademyGroup
  if (messageHubConnection.state !== SignalR.HubConnectionState.Connected) {
    messageHubConnection.onclose(async () => {
      console.log("Reconnecting...");
      await startHubConnection(messageHubConnection, "Message Hub");
    });

    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (
          messageHubConnection.state === SignalR.HubConnectionState.Connected
        ) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  if (academyId) {
    try {
      await messageHubConnection.invoke("JoinAcademyGroup", academyId);
      console.log(`Joined academy group: ${academyId}`);
    } catch (error) {
      console.error("Failed to join academy group", error);
    }
  }
};

export const subscribeToDiscussionHubMessages = (
  callback: (message: any) => void
) => {
  messageHubConnection.off("ReceiveMessage");
  messageHubConnection.on("ReceiveMessage", (message) => {
    callback(message);
  });
};

export const cleanupDiscussionHubSubscription = async (
  academyId: string | string[] | undefined
) => {
  if (!academyId) return;

  console.log(`Cleaning up for academy: ${academyId}`);

  if (messageHubConnection.state === SignalR.HubConnectionState.Connected) {
    await messageHubConnection.invoke("LeaveAcademyGroup", academyId);
    console.log(`Left academy group: ${academyId}`);
  }

  messageHubConnection.off("ReceiveMessage");
};

// MESSAGE REPLIES i.e responses to a message
export const startSignalRConnectionForMessageResponses = async (
  messageId: string | string[] | undefined
) => {
  await startHubConnection(messageHubConnection, "Message Replies");

  // Wait for the connection to be in the "Connected" state before invoking the join method
  if (messageHubConnection.state !== SignalR.HubConnectionState.Connected) {
    messageHubConnection.onclose(async () => {
      console.log("Reconnecting...");
      await startHubConnection(messageHubConnection, "Message Hub");
    });

    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (
          messageHubConnection.state === SignalR.HubConnectionState.Connected
        ) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  if (messageId) {
    try {
      await messageHubConnection.invoke("JoinMessageGroup", messageId);
      console.log(`Joined message group: ${messageId}`);
    } catch (error) {
      console.error("Failed to join message group", error);
    }
  }
};

export const subscribeToMessageReplies = (
  callback: (messageReply: any) => void
) => {
  messageHubConnection.off("ReceiveReply");
  messageHubConnection.on("ReceiveReply", (messageReply) => {
    callback(messageReply);
  });
};

export const cleanupMessageRepliesSubscription = async (
  messageId: string | string[] | undefined
) => {
  if (!messageId) return;

  console.log(`Cleaning up for message: ${messageId}`);

  if (messageHubConnection.state === SignalR.HubConnectionState.Connected) {
    await messageHubConnection.invoke("LeaveMessageGroup", messageId);
    console.log(`Left message group: ${messageId}`);
  }

  messageHubConnection.off("ReceiveReply");
};

// NOTIFICATION SERVICES
export const startSignalRConnectionForNotifications = async () => {
  await startHubConnection(notificationHubConnection, "Notification Hub");

  // Wait for the connection to be in the "Connected" state before invoking JoinNotificationGroup
  if (
    notificationHubConnection.state !== SignalR.HubConnectionState.Connected
  ) {
    notificationHubConnection.onclose(async () => {
      console.log("Reconnecting...");
      await startHubConnection(notificationHubConnection, "Notification Hub");
    });

    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (
          notificationHubConnection.state ===
          SignalR.HubConnectionState.Connected
        ) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  // try {
  //   await notificationHubConnection.invoke("JoinNotificationGroup");
  //   console.log(`Joined Notification group`);
  // } catch (error) {
  //   console.error("Failed to join notification group", error);
  // }
};

export const subscribeToNotifications = (
  callback: (notification: any) => void
) => {
  notificationHubConnection.off("ReceiveNotification");
  notificationHubConnection.on("ReceiveNotification", (notification) => {
    callback(notification);
  });
};

export const cleanupNotificationSubscription = async () => {
  console.log(`Cleaning up for notification`);

  // if (
  //   notificationHubConnection.state === SignalR.HubConnectionState.Connected
  // ) {
  //   await notificationHubConnection.invoke("LeaveNotificationGroup");
  //   console.log(`Left notification group`);
  // }

  notificationHubConnection.off("ReceiveNotification");
};
