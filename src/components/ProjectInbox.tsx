
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, DollarSign, Eye, MessageSquare, Star } from 'lucide-react';

interface ProjectInboxProps {
  onProjectSelect: (project: any) => void;
  onBack: () => void;
}

const ProjectInbox: React.FC<ProjectInboxProps> = ({ onProjectSelect, onBack }) => {
  const [selectedTab, setSelectedTab] = useState('new');

  const projects = {
    new: [
      {
        id: 1,
        title: "Epic Space Opera Trailer",
        client: "Michael Chen",
        clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        budget: 3500,
        deadline: "2024-01-25",
        description: "Looking for a creator to bring my sci-fi novel to life with an epic space battle trailer. Need someone experienced with VFX and space environments.",
        genre: "Sci-Fi",
        duration: "90 seconds",
        postedTime: "2 hours ago",
        applicants: 8,
        clientRating: 4.7,
        tags: ["VFX", "Space", "Action", "Cinematic"]
      },
      {
        id: 2,
        title: "Dark Fantasy Horror Teaser",
        client: "Emma Rodriguez",
        clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
        budget: 2200,
        deadline: "2024-01-30",
        description: "Creating a dark fantasy book trailer with gothic horror elements. Looking for someone who can create atmospheric, moody visuals.",
        genre: "Horror/Fantasy",
        duration: "60 seconds",
        postedTime: "5 hours ago",
        applicants: 12,
        clientRating: 4.9,
        tags: ["Horror", "Gothic", "Atmosphere", "Dark"]
      },
      {
        id: 3,
        title: "Romantic Comedy Book Trailer",
        client: "Sarah Wilson",
        clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        budget: 1800,
        deadline: "2024-02-05",
        description: "Fun, light-hearted trailer for a romantic comedy novel. Need bright, colorful visuals with comedic timing.",
        genre: "Romance/Comedy",
        duration: "45 seconds",
        postedTime: "1 day ago",
        applicants: 15,
        clientRating: 4.6,
        tags: ["Romance", "Comedy", "Bright", "Fun"]
      }
    ],
    invited: [
      {
        id: 4,
        title: "Historical Drama Epic",
        client: "David Thompson",
        clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        budget: 4500,
        deadline: "2024-02-10",
        description: "Period piece set in medieval times. Need someone with experience in historical recreations and period-accurate visuals.",
        genre: "Historical Drama",
        duration: "2 minutes",
        postedTime: "3 hours ago",
        applicants: 5,
        clientRating: 4.8,
        tags: ["Historical", "Medieval", "Drama", "Period"],
        invited: true,
        inviteReason: "Your fantasy work portfolio matches this project perfectly!"
      }
    ],
    active: [
      {
        id: 5,
        title: "Cyberpunk Thriller Trailer",
        client: "Alex Kim",
        budget: 3200,
        deadline: "2024-01-20",
        status: "in_progress",
        progress: 60,
        lastUpdate: "2 hours ago"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'invited': return 'bg-purple-100 text-purple-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProjectCard = (project: any, type: string) => (
    <Card key={project.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold text-gray-900">{project.title}</h3>
              {project.invited && (
                <Badge className="bg-purple-100 text-purple-800">Invited</Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-2">
                <img 
                  src={project.clientAvatar}
                  alt={project.client}
                  className="w-6 h-6 rounded-full"
                />
                <span>{project.client}</span>
                {project.clientRating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{project.clientRating}</span>
                  </div>
                )}
              </div>
            </div>
            
            {type !== 'active' && (
              <>
                <p className="text-gray-700 mb-3 text-sm">{project.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>${project.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Due: {project.deadline}</span>
              </div>
              {project.applicants && (
                <span>{project.applicants} applicants</span>
              )}
              {project.postedTime && (
                <span>Posted {project.postedTime}</span>
              )}
            </div>

            {project.invited && project.inviteReason && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>Why you were invited:</strong> {project.inviteReason}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {type !== 'active' && (
              <>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask Question
                </Button>
              </>
            )}
            {type === 'active' && (
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Client
              </Button>
            )}
          </div>
          <Button 
            onClick={() => onProjectSelect(project)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            size="sm"
          >
            {type === 'active' ? 'Continue Work' : project.invited ? 'Submit Proposal' : 'Apply Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Opportunities</h1>
        <p className="text-gray-600">Find projects that match your skills and interests</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new" className="relative">
            New Projects
            <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
              {projects.new.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="invited" className="relative">
            Invitations
            <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">
              {projects.invited.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active Projects
            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
              {projects.active.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          {projects.new.map((project) => renderProjectCard(project, 'new'))}
        </TabsContent>

        <TabsContent value="invited" className="space-y-4">
          {projects.invited.map((project) => renderProjectCard(project, 'invited'))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {projects.active.map((project) => renderProjectCard(project, 'active'))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectInbox;
