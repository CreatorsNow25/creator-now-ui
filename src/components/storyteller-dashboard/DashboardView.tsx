
import React from 'react';
import StorytellerStats from './StorytellerStats';
import CreateProjectCTA from './CreateProjectCTA';
import ProjectsList from './ProjectsList';

interface Project {
  id: number;
  title: string;
  status: string;
  budget: number;
  deadline: string;
  creator: {
    name: string;
    avatar: string;
  };
  progress: number;
  lastUpdate: string;
}

interface DashboardViewProps {
  projects: Project[];
  onCreateProject: () => void;
  onViewProject: (project: Project) => void;
  onMessageCreator: (creatorName: string) => void;
}

const DashboardView = ({ projects, onCreateProject, onViewProject, onMessageCreator }: DashboardViewProps) => {
  return (
    <div className="space-y-8">
      <StorytellerStats />
      <CreateProjectCTA onCreateProject={onCreateProject} />
      <ProjectsList 
        projects={projects}
        onViewProject={onViewProject}
        onMessageCreator={onMessageCreator}
      />
    </div>
  );
};

export default DashboardView;
