
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, DollarSign, Shield, CheckCircle, Clock } from 'lucide-react';

interface PayoutSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

const PayoutSetup: React.FC<PayoutSetupProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [payoutData, setPayoutData] = useState({
    method: 'stripe',
    accountType: 'individual',
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    },
    taxId: '',
    bankAccount: {
      routingNumber: '',
      accountNumber: ''
    }
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label>Payout Method</Label>
              <div className="mt-3 space-y-3">
                <Card className={`cursor-pointer border-2 ${payoutData.method === 'stripe' ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Stripe Connect</h4>
                        <p className="text-sm text-gray-600">Fast, secure payments directly to your bank account</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer border-2 border-gray-200 opacity-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">PayPal</h4>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Label>Account Type</Label>
              <Select 
                value={payoutData.accountType} 
                onValueChange={(value) => setPayoutData({ ...payoutData, accountType: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {payoutData.accountType === 'business' && (
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={payoutData.businessName}
                  onChange={(e) => setPayoutData({ ...payoutData, businessName: e.target.value })}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={payoutData.firstName}
                  onChange={(e) => setPayoutData({ ...payoutData, firstName: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={payoutData.lastName}
                  onChange={(e) => setPayoutData({ ...payoutData, lastName: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={payoutData.email}
                onChange={(e) => setPayoutData({ ...payoutData, email: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={payoutData.phone}
                onChange={(e) => setPayoutData({ ...payoutData, phone: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <div className="mt-2 space-y-3">
                <Input
                  placeholder="Street address"
                  value={payoutData.address.line1}
                  onChange={(e) => setPayoutData({ 
                    ...payoutData, 
                    address: { ...payoutData.address, line1: e.target.value }
                  })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={payoutData.address.city}
                    onChange={(e) => setPayoutData({ 
                      ...payoutData, 
                      address: { ...payoutData.address, city: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="State"
                    value={payoutData.address.state}
                    onChange={(e) => setPayoutData({ 
                      ...payoutData, 
                      address: { ...payoutData.address, state: e.target.value }
                    })}
                  />
                </div>
                <Input
                  placeholder="ZIP/Postal code"
                  value={payoutData.address.postalCode}
                  onChange={(e) => setPayoutData({ 
                    ...payoutData, 
                    address: { ...payoutData.address, postalCode: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="taxId">Tax ID (SSN or EIN)</Label>
              <Input
                id="taxId"
                value={payoutData.taxId}
                onChange={(e) => setPayoutData({ ...payoutData, taxId: e.target.value })}
                className="mt-2"
                placeholder="XXX-XX-XXXX"
              />
              <p className="text-sm text-gray-600 mt-1">
                Required for tax reporting. This information is encrypted and secure.
              </p>
            </div>

            <div>
              <Label>Bank Account Details</Label>
              <div className="mt-2 space-y-3">
                <Input
                  placeholder="Routing Number"
                  value={payoutData.bankAccount.routingNumber}
                  onChange={(e) => setPayoutData({ 
                    ...payoutData, 
                    bankAccount: { ...payoutData.bankAccount, routingNumber: e.target.value }
                  })}
                />
                <Input
                  placeholder="Account Number"
                  value={payoutData.bankAccount.accountNumber}
                  onChange={(e) => setPayoutData({ 
                    ...payoutData, 
                    bankAccount: { ...payoutData.bankAccount, accountNumber: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-green-900 mb-1">Secure & Encrypted</h5>
                  <p className="text-sm text-green-700">
                    All financial information is encrypted and processed securely through Stripe. 
                    We never store your sensitive banking details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Choose Payout Method';
      case 2: return 'Personal Information';
      case 3: return 'Financial Details';
      default: return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={onCancel} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Setup Payouts</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Current Earnings Summary */}
      <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Pending Earnings</h3>
              <p className="text-3xl font-bold text-amber-600">$2,375.00</p>
              <p className="text-sm text-gray-600 mt-1">Available for payout once setup is complete</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-gray-600">Setup required</span>
              </div>
              <p className="text-sm text-gray-600">Setup takes 2-3 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Bank-level Security</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Stripe Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutSetup;
