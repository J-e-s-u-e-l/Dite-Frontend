export interface Task {
  taskId?: string | null;
  // taskId?: string;
  taskTitle: string;
  taskDescription: string;
  taskDueDate: string;
  taskCourseTag: string;
  taskStatus?: string;
}

export interface Message {
  academyId: string;
  messageId: string;
  messageTitle: string;
  messageBody: string;
  senderUserName: string;
  senderRoleInAcademy: string;
  trackName?: string;
  sentAtAgo: string;
  sentAt: string;
  totalNumberOfResponses: number;
}

export interface MessagesResponse {
  status: boolean;
  message: string;
  data: {
    messages: Message[];
    remainingMessagesCount: number;
  };
}

export interface MessageDetailsResponse {
  status: boolean;
  message: string;
  data: {
    message: MessageDetails[];
    responses: MessageResponse[];
  };
}

export interface MessageResponse {
  responseBody: string;
  responderUsername: string;
  responderRoleInAcademy: string;
  sentAtAgo: string;
  sentAt: string;
}

export interface MessageDetails {
  messageTitle: string;
  messageBody: string;
  senderUserName: string;
  senderRoleInAcademy: string;
  trackName?: string;
  sentAtAgo: string;
  totalNumberOfResponses: number;
}
