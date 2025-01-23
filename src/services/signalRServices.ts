import * as SignalR from "@microsoft/signalr";

const hubConnection = new SignalR.HubConnectionBuilder()
  .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/message-hub`)
  .withAutomaticReconnect()
  .build();

export const startSignalRConnection = async () => {
  try {
    if (hubConnection.state === "Disconnected") {
      await hubConnection.start();
      console.log("SignalR connection established");
    } else {
      console.log("SignalR connection is already active");
    }

    hubConnection.onreconnecting(() => {
      console.log("SignalR connection lost. Attempting to reconnect...");
    });

    hubConnection.onreconnected(() => {
      console.log("SignalR connection successfully reestablished.");
    });

    hubConnection.onclose(async () => {
      console.error("SignalR connection closed. Reconnecting...");
      try {
        await hubConnection.start();
        console.log("Reconnected successfully.");
      } catch (closeError) {
        console.error("Reconnection failed", closeError);
      }
    });
  } catch (error) {
    console.error("Error while starting SignalR connection", error);
  }

  // Retry mechanism for reconnect
  setTimeout(async () => {
    try {
      if (hubConnection.state === "Disconnected") {
        await hubConnection.start();
        console.log("Retry successful: SignalR connection established");
      }
      // else {
      //   console.log(`Cannot retry: Current state is ${hubConnection.state}`);
      // }
    } catch (retryError) {
      console.error("Retry failed", retryError);
    }
  }, 3000);
};

export const subscribeToMessages = (callback: (message: any) => void) => {
  hubConnection.on("ReceiveMessage", (message) => {
    callback(message);
  });
};
