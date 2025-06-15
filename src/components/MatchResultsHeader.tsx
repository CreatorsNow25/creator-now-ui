
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface MatchResultsHeaderProps {
  onBack: () => void;
}

const MatchResultsHeader: React.FC<MatchResultsHeaderProps> = ({ onBack }) => {
  return (
    <div className="mb-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfect Matches Found</h1>
      <p className="text-gray-600">We found 5 creators that match your project requirements</p>
    </div>
  );
};

export default MatchResultsHeader;
