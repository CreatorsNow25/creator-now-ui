
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowLeft, CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  project: any;
  onComplete: () => void;
  onSkip: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ project, onComplete, onSkip }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1500);
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair', 
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={onComplete} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Completed!</h1>
          <p className="text-gray-600">Your trailer is ready. Please rate your experience with Alex Thompson.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rate Your Experience</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Project Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {project?.title || 'Epic Fantasy Adventure Trailer'}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Creator: Alex Thompson</span>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
              <span>Delivered: January 15, 2024</span>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center space-x-4 p-4 border rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
              alt="Alex Thompson"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Alex Thompson</h4>
              <p className="text-sm text-gray-600">Sci-Fi & Fantasy Specialist</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.9 (127 reviews)</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">How was your experience?</h4>
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <p className="text-sm text-gray-600">
                {ratingLabels[hoverRating || rating as keyof typeof ratingLabels]}
              </p>
            )}
          </div>

          {/* Written Review */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Write a review (optional)</h4>
            <Textarea
              placeholder="Share your experience working with Alex. How was the communication? Did they deliver what you expected?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-600 mt-2">
              Your review helps other storytellers find great creators and helps Alex improve their service.
            </p>
          </div>

          {/* Quick Rating Options */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">What stood out? (optional)</h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Great communication',
                'On-time delivery', 
                'Exceeded expectations',
                'Creative vision',
                'Professional quality',
                'Responsive to feedback'
              ].map((tag) => (
                <Button key={tag} variant="outline" size="sm" className="text-xs">
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onSkip} className="flex-1">
              Skip Review
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Reviews are public and help build trust in our community. You can edit your review anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewForm;
