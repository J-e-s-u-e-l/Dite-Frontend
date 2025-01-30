import * as SignalR from "@microsoft/signalr";

const messageHubConnection = new SignalR.HubConnectionBuilder()
  .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/message-hub`)
  .withAutomaticReconnect()
  .build();

const notificationHubConnection = new SignalR.HubConnectionBuilder()
  .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notification-hub`)
  .withAutomaticReconnect()
  .build();

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

    // connection.onclose(async () => {
    //   console.error(`${hubName} connection closed. Reconnecting...`);
    //   try {
    //     await connection.start();
    //     console.log(`${hubName} reconnected successfully.`);
    //   } catch (closeError) {
    //     console.error(`${hubName} reconnection failed`, closeError);
    //   }
    // });
  } catch (error) {
    console.error(`Error while starting ${hubName} connection`, error);
  }

  // Retry mechanism for reconnect
  // setTimeout(async () => {
  //   try {
  //     if (connection.state === "Disconnected") {
  //       await connection.start();
  //       console.log(`Retry successful: ${hubName} connection established.`);
  //     }
  //   } catch (retryError) {
  //     console.error(`${hubName} retry failed`, retryError);
  //   }
  // }, 3000);
};

export const subscribeToMessages = (callback: (message: any) => void) => {
  messageHubConnection.off("ReceiveMessage");
  messageHubConnection.on("ReceiveMessage", (message) => {
    callback(message);
  });
};

export const cancelSubscriptionToMessages = () => {
  messageHubConnection.off("ReceiveMessage");
};

export const subscribeToNotifications = (
  callback: (notification: any) => void
) => {
  notificationHubConnection.on("ReceiveNotification", (notification) => {
    callback(notification);
  });
};

export const startSignalRConnectionForMessages = async () => {
  await startHubConnection(messageHubConnection, "Message Hub");
};

export const startSignalRConnectionForNotifications = async () => {
  await startHubConnection(notificationHubConnection, "Notification Hub");
};
