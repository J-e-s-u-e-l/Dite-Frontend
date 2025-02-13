export interface Task {
  taskId?: string | null;
  // taskId?: string;
  taskTitle: string;
  taskDescription: string;
  taskDueDate: string;
  taskCourseTag: string;
  taskStatus?: string;
}
