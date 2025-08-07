
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Sparkles, User } from 'lucide-react';

interface GreetingModalProps {
  onNameSet: (name: string) => void;
}

const timeQuotes = [
  "always remember that time is the most valuable thing you can spend.",
  "time flies when you're making the most of every moment.",
  "the best time to plant a tree was 20 years ago. The second best time is now.",
  "time is what we want most, but what we use worst.",
  "your time is limited, don't waste it living someone else's life.",
  "time is the coin of your life. It is the only coin you have, and you can determine how it will be spent.",
  "yesterday is history, tomorrow is a mystery, today is a gift - that's why it's called the present.",
  "time waits for no one, but it rewards those who use it wisely.",
  "every second is a chance to turn your life around.",
  "time is free, but it's priceless. You can't own it, but you can use it."
];

export const GreetingModal = ({ onNameSet }: GreetingModalProps) => {
  const [name, setName] = useState('');
  const [currentQuote] = useState(() => timeQuotes[Math.floor(Math.random() * timeQuotes.length)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSet(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-500">
      <Card className="max-w-lg mx-4 p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome!
            </h2>
          </div>
          <p className="text-muted-foreground">What should we call you?</p>
        </div>
        
        {/* Inspirational Quote Section */}
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-sm font-medium text-accent uppercase tracking-wider">Time Wisdom</span>
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </div>
          <p className="text-center text-foreground/90 leading-relaxed italic">
            {currentQuote}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-center text-lg border-primary/20 focus:border-primary"
              autoFocus
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={!name.trim()}
          >
            Get Started
          </Button>
        </form>
      </Card>
    </div>
  );
};
