export interface Board {
  id?: string;
  title: string;
  priority: number;
  tasks?: Task[];
}

export interface Task {
  taskId: string;
  boardId: string;
  description?: string;
  label: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  startDate?: Date;
  endDate?: Date;
}

export interface BoardDialogData {
  boardTitle: string;
}

export interface BoardDialogResult {
  boardTitle: string;
}

export interface TaskDialogData {
  task: Task;
  isNew: boolean;
  boardId: string;
  idx?: number;
}

export interface TaskDialogResult {
  task: Task;
  isNew: boolean;
  idx?: number;
}
