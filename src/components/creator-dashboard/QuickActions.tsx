
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface QuickActionsProps {
  onInbox: () => void;
  onPayout: () => void;
  onProfile: () => void;
}

const QuickActions = ({ onInbox, onPayout, onProfile }: QuickActionsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
      <CardContent className="p-6 text-center">
        <h3 className="font-bold text-gray-900 mb-2">Browse Projects</h3>
        <p className="text-gray-600 mb-4 text-sm">Find new opportunities that match your skills</p>
        <Button 
          onClick={onInbox}
          className="bg-gray-800 hover:bg-gray-900 text-white"
        >
          View Inbox
        </Button>
      </CardContent>
    </Card>
    <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
      <CardContent className="p-6 text-center">
        <h3 className="font-bold text-gray-900 mb-2">Setup Payouts</h3>
        <p className="text-gray-600 mb-4 text-sm">Connect your payment method to receive earnings</p>
        <Button
          onClick={onPayout}
          className="bg-gray-800 hover:bg-gray-900 text-white"
        >
          Setup Payments
        </Button>
      </CardContent>
    </Card>
    <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
      <CardContent className="p-6 text-center">
        <h3 className="font-bold text-gray-900 mb-2">Profile Settings</h3>
        <p className="text-gray-600 mb-4 text-sm">Update your portfolio and pricing</p>
        <Button
          onClick={onProfile}
          className="bg-gray-800 hover:bg-gray-900 text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default QuickActions;
