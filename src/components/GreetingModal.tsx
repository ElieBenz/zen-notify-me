import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Clock, Sparkles, User } from 'lucide-react';

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
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [isMinimizing, setIsMinimizing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const randomQuote = timeQuotes[Math.floor(Math.random() * timeQuotes.length)];
      setCurrentQuote(randomQuote);
      setShowQuote(true);
      
      // Auto minimize after 4 seconds with magical effect
      setTimeout(() => {
        setIsMinimizing(true);
        setTimeout(() => {
          onNameSet(name.trim());
        }, 1200);
      }, 4000);
    }
  };

  if (showQuote) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm transition-all duration-1000 ${isMinimizing ? 'opacity-0 backdrop-blur-0' : 'opacity-100'}`}>
        <Card className={`max-w-2xl mx-4 p-8 text-center bg-gradient-to-br from-card via-card to-accent/5 border-accent/20 shadow-2xl transition-all duration-1200 ease-in-out ${isMinimizing ? 'transform scale-0 rotate-12 translate-y-full translate-x-full opacity-0 blur-sm' : 'transform scale-100 rotate-0 translate-y-0 translate-x-0 opacity-100 blur-0'}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`p-3 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg transition-all duration-1000 ${isMinimizing ? 'animate-spin scale-150' : ''}`}>
              <Sparkles className={`h-8 w-8 text-primary-foreground transition-all duration-1000 ${isMinimizing ? 'animate-bounce' : 'animate-pulse'}`} />
            </div>
            <h2 className={`text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-1000 ${isMinimizing ? 'scale-75 blur-sm' : 'scale-100'}`}>
              Hey {name}!
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-accent">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Time Wisdom</span>
            </div>
            
            <p className={`text-lg leading-relaxed text-foreground/90 transition-all duration-1000 ${isMinimizing ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}>
              <span className="font-semibold text-primary">Hey {name}</span>, {currentQuote}
            </p>
            
            <div className="flex justify-center pt-4">
              <div className={`h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ${isMinimizing ? 'w-0 opacity-0' : 'w-24 opacity-100'}`}></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-500">
      <Card className="max-w-md mx-4 p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
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
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
};