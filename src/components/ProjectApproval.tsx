
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MessageSquare, Download, Eye, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectApprovalProps {
  project: any;
  onApprove: () => void;
  onReject: () => void;
  onRequestRevision: () => void;
  onBack: () => void;
}

const ProjectApproval: React.FC<ProjectApprovalProps> = ({ 
  project, 
  onApprove, 
  onReject, 
  onRequestRevision,
  onBack 
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // API call to approve project and release escrow funds
      const response = await fetch('/api/approve-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        },
        body: JSON.stringify({
          project_id: project.id,
          feedback: feedback
        })
      });

      if (response.ok) {
        toast({
          title: "Project Approved!",
          description: "Funds have been released to the creator.",
        });
        onApprove();
      } else {
        throw new Error('Failed to approve project');
      }
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback for the revision request.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/request-revision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        },
        body: JSON.stringify({
          project_id: project.id,
          feedback: feedback
        })
      });

      if (response.ok) {
        toast({
          title: "Revision Requested",
          description: "Your feedback has been sent to the creator.",
        });
        onRequestRevision();
      } else {
        throw new Error('Failed to request revision');
      }
    } catch (error) {
      console.error('Error requesting revision:', error);
      toast({
        title: "Request Failed",
        description: "Failed to request revision. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Final Deliverable</h1>
          <p className="text-gray-600">
            Review the completed work and decide whether to approve, request revisions, or reject.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Project
        </Button>
      </div>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{project?.title || 'Project Title'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Creator</h4>
              <p className="text-blue-700">Alex Thompson</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Project Fee</h4>
              <p className="text-green-700">${project?.budget?.toLocaleString() || '2,500'}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Status</h4>
              <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
            </div>
          </div>

          {/* Escrow Protection Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-amber-900 mb-1">Escrow Protection Active</h5>
                <p className="text-sm text-amber-700">
                  Your payment is safely held in escrow. Funds will only be released to the creator 
                  after you approve the final deliverable.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Deliverable */}
      <Card>
        <CardHeader>
          <CardTitle>Final Deliverable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            <img 
              src="https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&h=450&fit=crop"
              alt="Final deliverable"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-900">Epic Fantasy Adventure Trailer - Final</h4>
              <p className="text-sm text-gray-600">Delivered: January 15, 2024 • Duration: 90 seconds</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Creator's Notes</h5>
            <p className="text-sm text-blue-700">
              "I've incorporated all your feedback from the previous revision. The dragon battle scene 
              now has more dramatic lighting and enhanced fire effects. The final confrontation includes 
              the emotional beats you requested. I'm excited for you to see the final result!"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Review Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Your Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (optional for approval, required for revisions)
            </label>
            <Textarea
              placeholder="Share your thoughts on the final deliverable..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              onClick={handleApprove}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Processing...' : 'Approve & Release Payment'}
            </Button>
            
            <Button 
              onClick={handleRequestRevision}
              disabled={isSubmitting}
              variant="outline"
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Request Revision
            </Button>
            
            <Button 
              onClick={onReject}
              disabled={isSubmitting}
              variant="outline" 
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>

          <div className="text-xs text-gray-600">
            <p className="mb-1">
              <strong>Approve:</strong> Release funds to creator and mark project as complete
            </p>
            <p className="mb-1">
              <strong>Request Revision:</strong> Keep funds in escrow and request changes
            </p>
            <p>
              <strong>Reject:</strong> Dispute the deliverable (funds remain in escrow for review)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectApproval;
