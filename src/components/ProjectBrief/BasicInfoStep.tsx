
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProps } from './types';
import { GENRES, STYLES } from './constants';

const BasicInfoStep: React.FC<StepProps> = ({ formData, setFormData }) => {
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
            {GENRES.map((genre) => (
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
            {STYLES.map((style) => (
              <SelectItem key={style} value={style}>{style}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicInfoStep;
