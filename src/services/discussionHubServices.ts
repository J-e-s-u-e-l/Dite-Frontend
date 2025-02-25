import apiClient from "@/utils/apiClient";
import { MessagesResponse, MessageDetailsResponse } from "@/types/interfaces";

// export const fetchMessages = async (academyId, pageNumber): Promise<any[]> => {
export const fetchMessages = async (
  academyId: string | string[] | undefined,
  pageNumber: number
): Promise<MessagesResponse> => {
  try {
    const pageSize = 10;

    const payload = {
      params: {
        academyId,
        pageNumber,
        pageSize,
      },
    };
    const response = await apiClient.get(
      // `${process.env.NEXT_PUBLIC_API_URL}/${academyId}/messages`
      `${process.env.NEXT_PUBLIC_API_URL}/academies/messages`,
      payload
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      (error as { response?: { data?: { message: string } } }).response?.data
        ?.message || "Failed to fetch messages"
    );
  }
};

export const postMessage = async (messageData: {
  messageTitle: string;
  messageBody: string;
  academyId: string;
  trackId?: string;
}): Promise<MessagesResponse> => {
  try {
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/create`,
      messageData
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (postMessageError) {
    throw new Error(
      (postMessageError as { response?: { data?: { message: string } } })
        .response?.data?.message || "Failed to post message"
    );
  }
};

// import { MessageDetailsResponse } from "@/types/interfaces";

export const fetchMessageDetails = async (
  messageId: string
): Promise<MessageDetailsResponse> => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (fetchMessageDetailsError) {
    throw new Error(
      (
        fetchMessageDetailsError as {
          response?: { data?: { message: string } };
        }
      ).response?.data?.message || "Failed to fetch message details"
    );
  }
};

export const postResponseToMessage = async (
  parentId: string,
  responseMessage: string
): Promise<MessagesResponse> => {
  try {
    const payload = {
      parentId,
      responseMessage,
    };
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/responses`,
      payload
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (fetchMessageDetailsError) {
    throw new Error(
      (
        fetchMessageDetailsError as {
          response?: { data?: { message: string } };
        }
      ).response?.data?.message || "Failed to fetch message details"
    );
  }
};
