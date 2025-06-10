
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { StepProps } from './types';
import { DURATIONS } from './constants';

const BudgetTimelineStep: React.FC<StepProps> = ({ formData, setFormData }) => {
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
            {DURATIONS.map((duration) => (
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
};

export default BudgetTimelineStep;
