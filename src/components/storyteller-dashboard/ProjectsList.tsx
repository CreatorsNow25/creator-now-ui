
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Clock, MessageSquare } from 'lucide-react';
import { getDisplayName } from '@/hooks/useCreatorDashboard';

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

interface ProjectsListProps {
  projects: Project[];
  onViewProject: (project: Project) => void;
  onMessageCreator: (creatorName: string) => void;
}

const ProjectsList = ({ projects, onViewProject, onMessageCreator }: ProjectsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'pending_review': return 'Pending Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${project.budget.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.deadline}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 self-start">
                  <img 
                    src={project.creator.avatar}
                    alt={getDisplayName(project.creator.name)}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{getDisplayName(project.creator.name)}</p>
                    <p className="text-xs text-gray-600">Updated {project.lastUpdate}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onMessageCreator(project.creator.name)} className="flex-1 sm:flex-none">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
                <Button 
                  onClick={() => onViewProject(project)}
                  variant="default" 
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  View Project
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsList;
