
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { StepProps } from './types';

const BudgetTimelineStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleBudgetChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData({ ...formData, budget: [numValue] as [number] });
  };

  const handleDeadlineSelect = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, deadline: format(date, 'yyyy-MM-dd') });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="budget">Budget Range ($)</Label>
        <Input
          id="budget"
          type="number"
          value={formData.budget[0] || ''}
          onChange={(e) => handleBudgetChange(e.target.value)}
          placeholder="Enter your budget"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Project Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !formData.deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.deadline ? format(new Date(formData.deadline), 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.deadline ? new Date(formData.deadline) : undefined}
              onSelect={handleDeadlineSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BudgetTimelineStep;
