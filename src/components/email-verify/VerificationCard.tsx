
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VerificationStatusIcon from './VerificationStatusIcon';
import VerificationActions from './VerificationActions';

interface VerificationCardProps {
  status: 'loading' | 'success' | 'error';
  message: string;
}

const VerificationCard = ({ status, message }: VerificationCardProps) => {
  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying Your Email...';
      case 'success':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      default:
        return '';
    }
  };

  const getAlertClasses = () => {
    switch (status) {
      case 'success':
        return 'bg-green-900/50 border-green-500';
      case 'error':
        return 'bg-red-900/50 border-red-500';
      default:
        return 'bg-blue-900/50 border-blue-500';
    }
  };

  const getAlertTextClasses = () => {
    switch (status) {
      case 'success':
        return 'text-green-200';
      case 'error':
        return 'text-red-200';
      default:
        return 'text-blue-200';
    }
  };

  return (
    <Card className="bg-gray-900 border-white/20 text-white">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <VerificationStatusIcon status={status} />
        </div>
        <CardTitle className="text-2xl text-white">
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <Alert className={`mb-4 ${getAlertClasses()}`}>
          <AlertDescription className={getAlertTextClasses()}>
            {message || 'Please wait while we verify your email address...'}
          </AlertDescription>
        </Alert>

        <VerificationActions status={status} />
      </CardContent>
    </Card>
  );
};

export default VerificationCard;
