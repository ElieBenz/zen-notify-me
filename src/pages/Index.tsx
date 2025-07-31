import { useState, useMemo } from 'react';
import { AddReminderForm } from '@/components/AddReminderForm';
import { ReminderCard } from '@/components/ReminderCard';
import { useReminders } from '@/hooks/useReminders';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { reminders, addReminder, deleteReminder, toggleComplete } = useReminders();
  const { scheduleNotification, cancelNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const handleAddReminder = async (reminderData: Parameters<typeof addReminder>[0]) => {
    const newReminder = addReminder(reminderData);
    
    // Schedule notification for the new reminder
    if (newReminder.datetime > new Date()) {
      await scheduleNotification(newReminder);
      toast.success('Reminder added and notification scheduled!');
    } else {
      toast.success('Reminder added!');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    await cancelNotification(id);
    deleteReminder(id);
    toast.success('Reminder deleted!');
  };

  const handleToggleComplete = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder && !reminder.isCompleted) {
      await cancelNotification(id);
    }
    toggleComplete(id);
  };

  const filteredReminders = useMemo(() => {
    const now = new Date();
    
    switch (activeTab) {
      case 'pending':
        return reminders.filter(r => !r.isCompleted);
      case 'completed':
        return reminders.filter(r => r.isCompleted);
      case 'overdue':
        return reminders.filter(r => !r.isCompleted && r.datetime < now);
      case 'today':
        const today = new Date().toDateString();
        return reminders.filter(r => r.datetime.toDateString() === today);
      default:
        return reminders;
    }
  }, [reminders, activeTab]);

  const stats = useMemo(() => {
    const now = new Date();
    const pending = reminders.filter(r => !r.isCompleted).length;
    const completed = reminders.filter(r => r.isCompleted).length;
    const overdue = reminders.filter(r => !r.isCompleted && r.datetime < now).length;
    const today = reminders.filter(r => r.datetime.toDateString() === new Date().toDateString()).length;
    
    return { pending, completed, overdue, today };
  }, [reminders]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg">
              <Bell className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Zen Notify Me
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Your mindful reminder companion</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto mb-3">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20 w-fit mx-auto mb-3">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.today}</div>
            <div className="text-sm text-muted-foreground">Today</div>
          </div>
          <div className="text-center p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20 w-fit mx-auto mb-3">
              <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.overdue}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </div>
        </div>

        {/* Add Reminder Form */}
        <AddReminderForm onAddReminder={handleAddReminder} />

        {/* Reminders List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              All
              <Badge variant="secondary" className="ml-1 text-xs">
                {reminders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pending
              <Badge variant="secondary" className="ml-1 text-xs">
                {stats.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="today" className="text-xs">
              Today
              <Badge variant="secondary" className="ml-1 text-xs">
                {stats.today}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs">
              Overdue
              <Badge variant="destructive" className="ml-1 text-xs">
                {stats.overdue}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Done
              <Badge variant="secondary" className="ml-1 text-xs">
                {stats.completed}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredReminders.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No reminders found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'all' 
                    ? 'Create your first reminder to get started!'
                    : `No ${activeTab} reminders at the moment.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReminders
                  .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
                  .map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteReminder}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
