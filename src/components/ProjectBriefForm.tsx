
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, X } from 'lucide-react';

interface ProjectBriefFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const ProjectBriefForm: React.FC<ProjectBriefFormProps> = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    budget: [2500],
    description: '',
    deadline: '',
    style: '',
    duration: '',
    scriptFile: null as File | null
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const genres = [
    'Action/Adventure',
    'Drama',
    'Comedy',
    'Horror/Thriller',
    'Sci-Fi/Fantasy',
    'Romance',
    'Documentary',
    'Animation',
    'Other'
  ];

  const styles = [
    'Cinematic/Epic',
    'Modern/Clean',
    'Vintage/Retro',
    'Dark/Moody',
    'Bright/Colorful',
    'Minimalist',
    'Dramatic/Intense'
  ];

  const durations = [
    '30 seconds',
    '60 seconds',
    '90 seconds',
    '2 minutes',
    '3+ minutes'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, scriptFile: file });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, scriptFile: null });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit();
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
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="e.g., Epic Fantasy Adventure Trailer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="style">Visual Style</Label>
              <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select visual style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Budget Range</Label>
              <div className="mt-4 space-y-4">
                <Slider
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  max={10000}
                  min={500}
                  step={250}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>$500</span>
                  <span className="font-medium text-lg text-gray-900">
                    ${formData.budget[0].toLocaleString()}
                  </span>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Expected Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your story, key scenes, mood, and any specific requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 min-h-[150px]"
              />
              <p className="text-sm text-gray-600 mt-2">
                Be specific about your vision, target audience, and any particular elements you want to highlight.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Script or Treatment (Optional)</Label>
              <div className="mt-2">
                {!formData.scriptFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload your script, treatment, or reference materials</p>
                    <p className="text-sm text-gray-500 mb-4">PDF, DOC, TXT files up to 10MB</p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      id="script-upload"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('script-upload')?.click()}>
                      Choose File
                    </Button>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formData.scriptFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(formData.scriptFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">Project Summary</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Title:</span> {formData.title}</p>
                <p><span className="font-medium">Genre:</span> {formData.genre}</p>
                <p><span className="font-medium">Budget:</span> ${formData.budget[0].toLocaleString()}</p>
                <p><span className="font-medium">Duration:</span> {formData.duration}</p>
                <p><span className="font-medium">Deadline:</span> {formData.deadline}</p>
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
      case 2: return 'Budget & Timeline';
      case 3: return 'Project Details';
      case 4: return 'Review & Submit';
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
            <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
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
              className="!bg-black !text-white hover:!bg-gray-800 !border-black"
            >
              {currentStep === totalSteps ? 'Submit Project' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectBriefForm;
