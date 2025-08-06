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
import { useState, useRef, useEffect } from 'react';

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
  low: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  medium: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  high: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'
};

const categoryColors = {
  work: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  personal: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  health: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  shopping: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  appointment: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800',
  other: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
};

export const ReminderCard = ({ reminder, onToggleComplete, onDelete }: ReminderCardProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const IconComponent = categoryIcons[reminder.category];
  const isOverdue = new Date() > reminder.datetime && !reminder.isCompleted;
  const isToday = format(reminder.datetime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    
    // Only allow right swipe (positive deltaX)
    if (deltaX > 0) {
      setSwipeOffset(Math.min(deltaX, 120));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // If swiped more than 80px, delete the reminder
    if (swipeOffset > 80) {
      // Animate out before deleting
      setSwipeOffset(300);
      setTimeout(() => {
        onDelete(reminder.id);
      }, 200);
    } else {
      // Reset position
      setSwipeOffset(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    if (deltaX > 0) {
      setSwipeOffset(Math.min(deltaX, 120));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    if (swipeOffset > 80) {
      setSwipeOffset(300);
      setTimeout(() => {
        onDelete(reminder.id);
      }, 200);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setSwipeOffset(0);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        if (deltaX > 0) {
          setSwipeOffset(Math.min(deltaX, 120));
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (swipeOffset > 80) {
          setSwipeOffset(300);
          setTimeout(() => {
            onDelete(reminder.id);
          }, 200);
        } else {
          setSwipeOffset(0);
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, swipeOffset, onDelete, reminder.id]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Delete background */}
      <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-gradient-to-l from-red-500 to-red-400 text-white px-6 rounded-lg">
        <Trash2 className="h-5 w-5" />
        <span className="ml-2 font-medium">Delete</span>
      </div>
      
      {/* Main card */}
      <div
        ref={cardRef}
        className={`relative transition-transform duration-200 ease-out ${
          isDragging ? '' : 'transition-transform'
        }`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Card className={`transition-all duration-300 hover:shadow-lg border-2 ${
          reminder.isCompleted 
            ? 'opacity-60 bg-muted/30' 
            : 'bg-card hover:bg-card/80'
        } ${
          isOverdue 
            ? 'border-destructive/50 shadow-destructive/10' 
            : 'border-border hover:border-primary/20'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Checkbox
                  checked={reminder.isCompleted}
                  onCheckedChange={() => onToggleComplete(reminder.id)}
                  className="mt-1 h-5 w-5 transition-transform hover:scale-110"
                />
                {reminder.isCompleted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary animate-scale-in" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-semibold text-base leading-tight ${
                    reminder.isCompleted 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}>
                    {reminder.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(reminder.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {reminder.description && (
                  <p className={`text-sm text-muted-foreground mb-3 leading-relaxed ${
                    reminder.isCompleted ? 'line-through' : ''
                  }`}>
                    {reminder.description}
                  </p>
                )}

                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{format(reminder.datetime, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{format(reminder.datetime, 'HH:mm')}</span>
                  </div>
                  {isOverdue && !reminder.isCompleted && (
                    <div className="flex items-center gap-1.5 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Overdue</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-3 py-1.5 font-medium border ${categoryColors[reminder.category]}`}
                  >
                    <IconComponent className="h-3 w-3 mr-1.5" />
                    {reminder.category}
                  </Badge>
                  
                  <Badge className={`text-xs px-3 py-1.5 font-medium border ${priorityColors[reminder.priority]}`}>
                    {reminder.priority}
                  </Badge>

                  {isToday && !reminder.isCompleted && (
                    <Badge className="text-xs px-3 py-1.5 font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-sm">
                      Today
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};