
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';
import BrandHeader from './BrandHeader';

interface PasswordAccessFormProps {
  onAuthenticated: () => void;
}

const PasswordAccessForm = ({ onAuthenticated }: PasswordAccessFormProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Simple password - you can change this
  const ACCESS_PASSWORD = 'creators2024';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ACCESS_PASSWORD) {
      onAuthenticated();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <Card className="bg-gray-900 border-white/20">
      <CardHeader>
        <BrandHeader 
          title="Creators Now" 
          subtitle="Private Beta Access" 
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              type="password"
              placeholder="Enter access password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60"
              required
            />
          </div>
          {error && (
            <Alert className="bg-red-900/50 border-red-500">
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            Access Platform
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordAccessForm;
