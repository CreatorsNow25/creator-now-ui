
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, X, Star, DollarSign, Plus } from 'lucide-react';

interface ProfileWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    bio: '',
    specialties: [] as string[],
    portfolio: [] as any[],
    packages: [
      { name: 'Basic', price: 1500, deliveryTime: '5-7 days', description: '', features: [] },
      { name: 'Standard', price: 2500, deliveryTime: '7-10 days', description: '', features: [] },
      { name: 'Premium', price: 4000, deliveryTime: '10-14 days', description: '', features: [] }
    ]
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const specialtyOptions = [
    'Action/Adventure',
    'Sci-Fi/Fantasy', 
    'Drama/Thriller',
    'Horror',
    'Comedy',
    'Romance',
    'Documentary',
    'Animation',
    'Music Videos',
    'Corporate',
    'VFX/CGI',
    'Character Animation',
    'Environmental Design',
    'Sound Design',
    'Color Grading'
  ];

  const handleSpecialtyToggle = (specialty: string) => {
    const current = profileData.specialties;
    if (current.includes(specialty)) {
      setProfileData({
        ...profileData,
        specialties: current.filter(s => s !== specialty)
      });
    } else {
      setProfileData({
        ...profileData,
        specialties: [...current, specialty]
      });
    }
  };

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
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell potential clients about your experience, style, and what makes you unique..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="mt-2 min-h-[120px]"
              />
              <p className="text-sm text-gray-600 mt-2">
                A compelling bio increases your chances of being hired by 3x
              </p>
            </div>

            <div>
              <Label>Profile Photo</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload a professional headshot</p>
                <Button variant="outline" size="sm">Choose Photo</Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Your Specialties</Label>
              <p className="text-sm text-gray-600 mb-4">Select all genres and skills that apply to you</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specialtyOptions.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={profileData.specialties.includes(specialty) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSpecialtyToggle(specialty)}
                    className={`text-left justify-start ${
                      profileData.specialties.includes(specialty)
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : ''
                    }`}
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Portfolio</Label>
              <p className="text-sm text-gray-600 mb-4">Showcase your best work (at least 3 pieces recommended)</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload Video {i}</p>
                    <Button variant="outline" size="sm">Choose File</Button>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Portfolio Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Include your best and most recent work</li>
                  <li>• Show variety in styles and genres</li>
                  <li>• Keep videos under 2 minutes each</li>
                  <li>• Include before/after or process videos</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Service Packages</Label>
              <p className="text-sm text-gray-600 mb-4">Set up your pricing tiers to attract different types of clients</p>
              
              <div className="space-y-4">
                {profileData.packages.map((pkg, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <Badge variant={index === 1 ? 'default' : 'secondary'}>
                          {index === 1 ? 'Most Popular' : ''}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Price</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="number"
                              value={pkg.price}
                              onChange={(e) => {
                                const newPackages = [...profileData.packages];
                                newPackages[index].price = parseInt(e.target.value);
                                setProfileData({ ...profileData, packages: newPackages });
                              }}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">Delivery Time</Label>
                          <Input
                            value={pkg.deliveryTime}
                            onChange={(e) => {
                              const newPackages = [...profileData.packages];
                              newPackages[index].deliveryTime = e.target.value;
                              setProfileData({ ...profileData, packages: newPackages });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Description</Label>
                        <Textarea
                          placeholder={`Describe what's included in your ${pkg.name.toLowerCase()} package...`}
                          value={pkg.description}
                          onChange={(e) => {
                            const newPackages = [...profileData.packages];
                            newPackages[index].description = e.target.value;
                            setProfileData({ ...profileData, packages: newPackages });
                          }}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
      case 1: return 'Basic Information';
      case 2: return 'Skills & Specialties';
      case 3: return 'Portfolio';
      case 4: return 'Pricing Packages';
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
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

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
              {currentStep === totalSteps ? 'Complete Profile' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileWizard;
