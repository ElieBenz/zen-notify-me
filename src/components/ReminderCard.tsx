
import React from 'react';
import { Bell, Briefcase, User, Heart, ShoppingBag, Calendar, MoreHorizontal, Check, Circle, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  datetime: Date;
  category: 'work' | 'personal' | 'health' | 'shopping' | 'appointment' | 'other';
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
}

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onToggleComplete, onDelete }) => {
  const isOverdue = reminder.datetime < new Date() && !reminder.isCompleted;
  const isToday = reminder.datetime.toDateString() === new Date().toDateString();

  const getCategoryIcon = (category: string) => {
    const icons = {
      work: Briefcase,
      personal: User,
      health: Heart,
      shopping: ShoppingBag,
      appointment: Calendar,
      other: MoreHorizontal,
    };
    return icons[category as keyof typeof icons] || MoreHorizontal;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-500',
      medium: 'text-yellow-500',
      high: 'text-red-500',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      onDelete(reminder.id);
    }
  };

  const CategoryIcon = getCategoryIcon(reminder.category);

  return (
    <Card className={`
      mb-3 border-l-4 transition-all duration-200
      ${reminder.isCompleted ? 'opacity-70 border-l-green-500' : ''}
      ${isOverdue ? 'border-l-red-500' : 'border-l-primary'}
      ${reminder.isCompleted ? 'bg-muted/50' : 'bg-background'}
    `}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6"
              onClick={() => onToggleComplete(reminder.id)}
            >
              {reminder.isCompleted ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <CategoryIcon className="h-4 w-4 text-primary" />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className={`
            font-semibold text-sm
            ${reminder.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}
          `}>
            {reminder.title}
          </h3>
          
          {reminder.description && (
            <p className={`
              text-sm
              ${reminder.isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}
            `}>
              {reminder.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Calendar className={`h-3 w-3 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className={`
                ${isOverdue ? 'text-destructive font-medium' : ''}
                ${isToday ? 'text-yellow-600 font-medium' : 'text-muted-foreground'}
              `}>
                {formatDateTime(reminder.datetime)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(reminder.priority).replace('text-', 'bg-')}`} />
              <span className="text-muted-foreground capitalize">
                {reminder.priority}
              </span>
            </div>
          </div>

          {isOverdue && !reminder.isCompleted && (
            <div className="flex items-center gap-1 mt-2 px-2 py-1 bg-destructive/10 rounded-md w-fit">
              <AlertCircle className="h-3 w-3 text-destructive" />
              <span className="text-xs text-destructive font-medium">Overdue</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReminderCard;
