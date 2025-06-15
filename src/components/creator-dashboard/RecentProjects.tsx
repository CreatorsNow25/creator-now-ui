
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Clock, MessageSquare } from 'lucide-react';

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

interface RecentProjectsProps {
  projects: RecentProject[];
  onViewProject: (project: RecentProject) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'review': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'in_progress': return 'In Progress';
    case 'review': return 'Under Review';
    case 'completed': return 'Completed';
    default: return status;
  }
};

const RecentProjects = ({ projects, onViewProject }: RecentProjectsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Projects</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
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
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{project.client}</p>
                <p className="text-xs text-gray-600">Updated {project.lastUpdate}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Client
                </Button>
              </div>
              <Button
                onClick={() => onViewProject(project)}
                variant="default"
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 text-white"
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

export default RecentProjects;
