import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { StepProps } from './types';

const ReviewSubmitStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File size cannot exceed 10MB.");
        e.target.value = ''; // Clear the input
        return;
      }
      setFormData({ ...formData, scriptFile: file });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, scriptFile: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Script or Reference Materials (Optional)</Label>
        <div className="mt-2">
          {!formData.scriptFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload your script, treatment, or visual references</p>
              <div className="text-sm text-gray-500 mb-4 space-y-1 text-left w-fit mx-auto">
                <p><span className="font-semibold">Scripts & Documents:</span> PDF, DOC, TXT</p>
                <p><span className="font-semibold">Images & Moodboards:</span> JPG, PNG, GIF, SVG</p>
                <p><span className="font-semibold">Other Materials:</span> ZIP</p>
                <p className="mt-2 font-medium text-center">Max file size: 10MB</p>
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.svg,.zip"
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
};

export default ReviewSubmitStep;
