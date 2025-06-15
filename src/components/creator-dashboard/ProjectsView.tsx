
import React from 'react';
import { Button } from '@/components/ui/button';
import RecentProjects from './RecentProjects';

interface RecentProject {
  id: number;
  title: string;
  client: string;
  status: string;
  budget: number;
  deadline: string;
  progress: number;
  lastUpdate: string;
}

interface ProjectsViewProps {
  projects: RecentProject[];
  onViewProject: (project: RecentProject) => void;
  onBrowseProjects: () => void;
}

const ProjectsView = ({ projects, onViewProject, onBrowseProjects }: ProjectsViewProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Button 
          onClick={onBrowseProjects}
          className="bg-black hover:bg-gray-800 text-white"
        >
          Browse New Projects
        </Button>
      </div>
      <RecentProjects
        projects={projects}
        onViewProject={onViewProject}
      />
    </div>
  );
};

export default ProjectsView;
