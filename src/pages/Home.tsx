
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Bell } from 'lucide-react';
import { useReminders } from '@/hooks/useReminders';
import ReminderCard from '@/components/ReminderCard';

const HomePage: React.FC = () => {
  const { reminders, addReminder, deleteReminder, toggleComplete } = useReminders();
  const [activeTab, setActiveTab] = useState('all');
  const [userName, setUserName] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    checkUserName();
  }, []);

  const checkUserName = () => {
    const storedName = localStorage.getItem('zen-notify-username');
    if (storedName) {
      setUserName(storedName);
    }
  };

  const getFilteredReminders = () => {
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
  };

  const filteredReminders = getFilteredReminders().sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  const totalReminders = reminders.length;
  const pendingReminders = reminders.filter(r => !r.isCompleted).length;
  const completedReminders = reminders.filter(r => r.isCompleted).length;
  const todayReminders = reminders.filter(r => r.datetime.toDateString() === new Date().toDateString()).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/148830d0-6df5-4b9a-b083-d51ba5b37990.png"
                alt="Zen Notify Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-primary mb-2">Zen Notify Me</h1>
          
          {userName && (
            <div className="mb-2">
              <p className="text-muted-foreground">Welcome back, {userName}!</p>
            </div>
          )}
          
          <p className="text-muted-foreground">Your mindful reminder companion</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalReminders}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{pendingReminders}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{completedReminders}</div>
            <div className="text-sm text-muted-foreground">Done</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{todayReminders}</div>
            <div className="text-sm text-muted-foreground">Today</div>
          </Card>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Reminder
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({totalReminders})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingReminders})</TabsTrigger>
            <TabsTrigger value="today">Today ({todayReminders})</TabsTrigger>
            <TabsTrigger value="completed">Done ({completedReminders})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Reminders List */}
        <div className="space-y-3">
          {filteredReminders.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reminders found</h3>
              <p className="text-muted-foreground">
                {activeTab === 'all' 
                  ? 'Create your first reminder to get started!'
                  : `No ${activeTab} reminders at the moment.`
                }
              </p>
            </Card>
          ) : (
            filteredReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggleComplete={toggleComplete}
                onDelete={deleteReminder}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
