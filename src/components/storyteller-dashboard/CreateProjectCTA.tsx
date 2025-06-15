
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface CreateProjectCTAProps {
  onCreateProject: () => void;
}

const CreateProjectCTA = ({ onCreateProject }: CreateProjectCTAProps) => {
  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardContent className="p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to bring your next story to life?</h3>
        <p className="text-gray-600 mb-6">Connect with top AI creators and transform your vision into stunning trailers</p>
        <Button 
          onClick={onCreateProject}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateProjectCTA;
