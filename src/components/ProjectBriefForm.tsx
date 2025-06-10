
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { ProjectBriefFormProps, ProjectFormData } from './ProjectBrief/types';
import { TOTAL_STEPS } from './ProjectBrief/constants';
import BasicInfoStep from './ProjectBrief/BasicInfoStep';
import BudgetTimelineStep from './ProjectBrief/BudgetTimelineStep';
import ProjectDetailsStep from './ProjectBrief/ProjectDetailsStep';
import ReviewSubmitStep from './ProjectBrief/ReviewSubmitStep';

const ProjectBriefForm: React.FC<ProjectBriefFormProps> = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    genre: '',
    budget: [2500],
    description: '',
    deadline: '',
    style: '',
    duration: '',
    scriptFile: null
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
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
    const stepProps = { formData, setFormData };
    
    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <BudgetTimelineStep {...stepProps} />;
      case 3:
        return <ProjectDetailsStep {...stepProps} />;
      case 4:
        return <ReviewSubmitStep {...stepProps} />;
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
            <span className="text-sm text-gray-600">Step {currentStep} of {TOTAL_STEPS}</span>
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
              style={{ backgroundColor: '#000000', color: '#ffffff', borderColor: '#000000' }}
              className="hover:bg-gray-800"
            >
              {currentStep === TOTAL_STEPS ? 'Submit Project' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectBriefForm;
