import { Reminder } from '@/types/reminder';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Trash2,
  AlertCircle,
  Briefcase,
  User,
  Heart,
  ShoppingCart,
  Stethoscope,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  work: Briefcase,
  personal: User,
  health: Heart,
  shopping: ShoppingCart,
  appointment: Stethoscope,
  other: MoreHorizontal
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

export const ReminderCard = ({ reminder, onToggleComplete, onDelete }: ReminderCardProps) => {
  const IconComponent = categoryIcons[reminder.category];
  const isOverdue = new Date() > reminder.datetime && !reminder.isCompleted;
  const isToday = format(reminder.datetime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <Card className={`transition-all duration-200 ${
      reminder.isCompleted ? 'opacity-60' : ''
    } ${isOverdue ? 'border-destructive' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={reminder.isCompleted}
            onCheckedChange={() => onToggleComplete(reminder.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-medium text-sm ${
                reminder.isCompleted ? 'line-through text-muted-foreground' : ''
              }`}>
                {reminder.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(reminder.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {reminder.description && (
              <p className={`text-xs text-muted-foreground mb-2 ${
                reminder.isCompleted ? 'line-through' : ''
              }`}>
                {reminder.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="h-3 w-3" />
              <span>{format(reminder.datetime, 'MMM dd, yyyy')}</span>
              <Clock className="h-3 w-3 ml-2" />
              <span>{format(reminder.datetime, 'HH:mm')}</span>
              {isOverdue && !reminder.isCompleted && (
                <AlertCircle className="h-3 w-3 text-destructive ml-2" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                <IconComponent className="h-3 w-3 mr-1" />
                {reminder.category}
              </Badge>
              
              <Badge className={`text-xs px-2 py-0.5 ${priorityColors[reminder.priority]}`}>
                {reminder.priority}
              </Badge>

              {isToday && !reminder.isCompleted && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  Today
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};