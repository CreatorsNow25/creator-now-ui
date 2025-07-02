
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface VerificationStatusIconProps {
  status: 'loading' | 'success' | 'error';
}

const VerificationStatusIcon = ({ status }: VerificationStatusIconProps) => {
  if (status === 'loading') {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>;
  }
  
  if (status === 'success') {
    return <CheckCircle className="w-12 h-12 text-green-400" />;
  }
  
  return <XCircle className="w-12 h-12 text-red-400" />;
};

export default VerificationStatusIcon;
