export interface Board{
  id?: string;
  title?: string;
  priority?: number;
  tasks?: Task[];
}

export interface Task{
  taskId?: string;
  boardId?: string;
  description?: string;
  label?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  startDate?: Date;
  endDate?: Date;
}
