import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, X, Star, DollarSign, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete, onCancel }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    bio: '',
    photo: null as File | null,
    photoPreview: '',
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData({
        ...profileData,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!profileData.bio.trim()) {
          toast({
            variant: "destructive",
            title: "Bio Required",
            description: "Please write a bio to continue."
          });
          return false;
        }
        if (!profileData.photo) {
          toast({
            variant: "destructive",
            title: "Photo Required",
            description: "Please upload a headshot to continue."
          });
          return false;
        }
        return true;
      case 2:
        if (profileData.specialties.length === 0) {
          toast({
            variant: "destructive",
            title: "Specialties Required",
            description: "Please select at least one specialty to continue."
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

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
    if (!validateStep()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete profile
      toast({
        title: "Profile Complete!",
        description: "Your creator profile has been successfully set up."
      });
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-700 font-medium">
                  Both a bio and headshot are required to proceed
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                placeholder="Tell potential clients about your experience, style, and what makes you unique..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="mt-2 min-h-[120px]"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                A compelling bio increases your chances of being hired by 3x
              </p>
            </div>

            <div>
              <Label>Headshot *</Label>
              <div className="mt-2">
                {!profileData.photoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload a headshot</p>
                    <p className="text-xs text-gray-500 mb-3">JPG, PNG up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      type="button"
                    >
                      Choose Photo
                    </Button>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={profileData.photoPreview}
                      alt="Profile preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setProfileData({ ...profileData, photo: null, photoPreview: '' })}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Your Specialties *</Label>
              <p className="text-sm text-gray-600 mb-4">Select all genres and skills that apply to you (at least one required)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specialtyOptions.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={profileData.specialties.includes(specialty) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSpecialtyToggle(specialty)}
                    className={`text-left justify-start ${
                      profileData.specialties.includes(specialty)
                        ? 'bg-black hover:bg-gray-800'
                        : ''
                    }`}
                    type="button"
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
              {profileData.specialties.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {profileData.specialties.length} specialt{profileData.specialties.length === 1 ? 'y' : 'ies'} selected
                </p>
              )}
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
                    <Button variant="outline" size="sm" type="button">Choose File</Button>
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

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return profileData.bio.trim() && profileData.photo;
      case 2:
        return profileData.specialties.length > 0;
      default:
        return true;
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
              type="button"
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-black hover:bg-gray-800 text-white"
              disabled={currentStep <= 2 && !isStepComplete()}
              type="button"
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
