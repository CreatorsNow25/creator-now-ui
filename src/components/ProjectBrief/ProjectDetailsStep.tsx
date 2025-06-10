
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StepProps } from './types';

const ProjectDetailsStep: React.FC<StepProps> = ({ formData, setFormData }) => {
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
};

export default ProjectDetailsStep;
