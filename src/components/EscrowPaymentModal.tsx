
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, CreditCard, Shield, Lock, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EscrowPaymentModalProps {
  project: any;
  creatorConnectId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({ 
  project, 
  creatorConnectId,
  onComplete, 
  onCancel 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const { toast } = useToast();

  const projectFee = project?.budget || 2500;
  const platformFee = Math.round(projectFee * 0.15); // 15% platform fee
  const processingFee = 30;
  const total = projectFee + platformFee + processingFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create escrow payment session
      const response = await fetch('/api/create-escrow-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        },
        body: JSON.stringify({
          project_id: project.id,
          creator_connect_id: creatorConnectId,
          project_fee: projectFee,
          platform_fee: platformFee,
          processing_fee: processingFee,
          total_amount: total,
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-canceled`
        })
      });

      const data = await response.json();
      
      if (data.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        throw new Error(data.error || 'Payment setup failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Secure Escrow Payment</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Project Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {project?.title || 'Project Payment'}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>AI Creator: {project?.creator?.name || 'Creator'}</span>
              <Badge className="bg-blue-100 text-blue-800">Escrow Protected</Badge>
            </div>
          </div>

          {/* Escrow Protection Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-green-900 mb-1">Escrow Protection</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Funds held securely until project completion</li>
                  <li>• Creator receives payout only after your approval</li>
                  <li>• Full refund protection if work isn't delivered</li>
                  <li>• Automated dispute resolution process</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Payment Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project Fee (to Creator)</span>
                <span className="font-medium">${projectFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee (15%)</span>
                <span className="font-medium">${platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee</span>
                <span className="font-medium">${processingFee}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Charge</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payout Timeline */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-amber-900 mb-1">Creator Payout Schedule</h5>
                <div className="text-sm text-amber-700 space-y-1">
                  <div>• First 90 days: 100% of project fee (${projectFee.toLocaleString()})</div>
                  <div>• After 90 days: 95% of project fee</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-900 mb-1">Important</h5>
                <p className="text-sm text-yellow-700">
                  You will be redirected to Stripe Checkout to complete this secure payment. 
                  Funds will be held in escrow until you approve the final deliverable.
                </p>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <CreditCard className="w-3 h-3" />
              <span>Stripe Secure</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay $${total.toLocaleString()} (Escrow Protected)`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscrowPaymentModal;
