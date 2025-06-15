
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, DollarSign, Star, Eye } from 'lucide-react';

interface StatsProps {
  activeProjects: number;
  totalEarnings: number;
  averageRating: number;
  completedProjects: number;
}

const DashboardStats = ({
  activeProjects,
  totalEarnings,
  averageRating,
  completedProjects,
}: StatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Projects</p>
            <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Rating</p>
            <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Eye className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default DashboardStats;
