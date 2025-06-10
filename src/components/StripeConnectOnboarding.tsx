
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Shield, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StripeConnectOnboardingProps {
  onComplete?: () => void;
  existingAccountId?: string;
}

const StripeConnectOnboarding: React.FC<StripeConnectOnboardingProps> = ({ 
  onComplete, 
  existingAccountId 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'none' | 'pending' | 'complete'>('none');
  const { toast } = useToast();

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      // This will call the create-connect-account edge function
      const response = await fetch('/api/create-connect-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        },
        body: JSON.stringify({
          refresh_url: window.location.href,
          return_url: window.location.href + '?setup=complete'
        })
      });

      const data = await response.json();
      
      if (data.account_link_url) {
        // Redirect to Stripe Connect onboarding
        window.location.href = data.account_link_url;
      } else {
        throw new Error(data.error || 'Failed to create Connect account');
      }
    } catch (error) {
      console.error('Error creating Connect account:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to start payout setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!existingAccountId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/check-connect-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        },
        body: JSON.stringify({ account_id: existingAccountId })
      });

      const data = await response.json();
      setAccountStatus(data.charges_enabled ? 'complete' : 'pending');
      
      if (data.charges_enabled && onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error checking account status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Setup Payouts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payout Structure Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">AI Creator Payout Structure</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center justify-between">
                <span>First 90 days:</span>
                <Badge className="bg-green-100 text-green-800">100% of project fee</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>After 90 days:</span>
                <Badge className="bg-blue-100 text-blue-800">95% of project fee</Badge>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Shield className="w-4 h-4" />
                <span>Funds held in secure escrow until project completion</span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          {existingAccountId && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Connect Account Status:</span>
                <Badge className={
                  accountStatus === 'complete' ? 'bg-green-100 text-green-800' :
                  accountStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {accountStatus === 'complete' ? 'Active' :
                   accountStatus === 'pending' ? 'Setup Required' : 'Not Setup'}
                </Badge>
              </div>
              
              {accountStatus !== 'complete' && (
                <Button 
                  onClick={handleCheckStatus}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking Status...
                    </>
                  ) : (
                    'Check Account Status'
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Setup Button */}
          {!existingAccountId || accountStatus !== 'complete' ? (
            <Button 
              onClick={handleCreateAccount}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Setup Stripe Connect Account
                </>
              )}
            </Button>
          ) : (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Payout account is ready!</span>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>Setup takes 2-3 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3" />
              <span>Powered by Stripe Connect - Bank-level security</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeConnectOnboarding;
