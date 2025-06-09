
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Clock, DollarSign, Star, CheckCircle } from 'lucide-react';

interface ProposalModalProps {
  project: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ project, onSubmit, onCancel }) => {
  const [proposal, setProposal] = useState({
    price: 2500,
    deliveryTime: '7-10 days',
    message: '',
    deliverables: [
      'Initial concept and storyboard',
      'First draft trailer',
      'Final polished version with sound design',
      '3 rounds of revisions included'
    ],
    timeline: [
      { phase: 'Concept & Planning', duration: '1-2 days' },
      { phase: 'Production & Animation', duration: '4-6 days' },
      { phase: 'Post-Production & Polish', duration: '2-3 days' }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 2000);
  };

  const addDeliverable = () => {
    setProposal({
      ...proposal,
      deliverables: [...proposal.deliverables, '']
    });
  };

  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = value;
    setProposal({ ...proposal, deliverables: newDeliverables });
  };

  const removeDeliverable = (index: number) => {
    setProposal({
      ...proposal,
      deliverables: proposal.deliverables.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Submit Proposal</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Project Summary */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {project?.title || 'Epic Space Opera Trailer'}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                  alt="Client"
                  className="w-6 h-6 rounded-full"
                />
                <span>Michael Chen</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.7</span>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Sci-Fi</Badge>
              <span>Budget: $3,500</span>
              <span>Due: Jan 25, 2024</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Proposal Details */}
            <div className="space-y-6">
              {/* Pricing */}
              <div>
                <Label htmlFor="price">Your Proposed Price</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    value={proposal.price}
                    onChange={(e) => setProposal({ ...proposal, price: parseInt(e.target.value) })}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Client budget: $3,500 • You'll receive 95% after platform fees
                </p>
              </div>

              {/* Delivery Time */}
              <div>
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="deliveryTime"
                    value={proposal.deliveryTime}
                    onChange={(e) => setProposal({ ...proposal, deliveryTime: e.target.value })}
                    className="pl-10"
                    placeholder="e.g., 7-10 days"
                  />
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <Label htmlFor="message">Cover Letter</Label>
                <Textarea
                  id="message"
                  placeholder="Introduce yourself and explain why you're the perfect fit for this project..."
                  value={proposal.message}
                  onChange={(e) => setProposal({ ...proposal, message: e.target.value })}
                  className="mt-2 min-h-[120px]"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Personalized proposals get 3x more responses
                </p>
              </div>

              {/* Deliverables */}
              <div>
                <Label>What You'll Deliver</Label>
                <div className="mt-2 space-y-2">
                  {proposal.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <Input
                        value={deliverable}
                        onChange={(e) => updateDeliverable(index, e.target.value)}
                        placeholder="Enter deliverable..."
                        className="flex-1"
                      />
                      {proposal.deliverables.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDeliverable(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addDeliverable}
                  className="mt-2"
                >
                  Add Deliverable
                </Button>
              </div>
            </div>

            {/* Right Column - Timeline & Summary */}
            <div className="space-y-6">
              {/* Project Timeline */}
              <div>
                <Label>Project Timeline</Label>
                <div className="mt-2 space-y-3">
                  {proposal.timeline.map((phase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{phase.phase}</p>
                        <p className="text-sm text-gray-600">{phase.duration}</p>
                      </div>
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-medium text-sm">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposal Summary */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Proposal Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Price</span>
                    <span className="font-medium">${proposal.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee (5%)</span>
                    <span className="font-medium">-${(proposal.price * 0.05).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>You'll Receive</span>
                    <span className="text-green-600">${(proposal.price * 0.95).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Time</span>
                      <span className="font-medium">{proposal.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revisions</span>
                      <span className="font-medium">3 included</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Proposal Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Reference specific details from the project brief</li>
                  <li>• Mention relevant portfolio pieces</li>
                  <li>• Be competitive but don't undervalue your work</li>
                  <li>• Ask clarifying questions if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Save as Draft
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !proposal.message.trim()}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Proposal'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalModal;
