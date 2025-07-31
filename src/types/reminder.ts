export interface Reminder {
  id: string;
  title: string;
  description?: string;
  datetime: Date;
  category: ReminderCategory;
  isCompleted: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export type ReminderCategory = 
  | 'work' 
  | 'personal' 
  | 'health' 
  | 'shopping' 
  | 'appointment' 
  | 'other';