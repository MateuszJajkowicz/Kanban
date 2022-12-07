export interface Board{
  id?: string;
  title?: string;
  priority?: number;
  tasks?: Task[];
}

export interface Task{
  description?: string;
  label?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  startDate?: Date | null;
  endDate?: Date | null;
}
