
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, DollarSign, Star, CheckCircle } from 'lucide-react';

const StorytellerStats = () => {
  const stats = [
    {
      title: "Active Projects",
      value: "3",
      icon: Eye,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Spent",
      value: "$7,500",
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      icon: Star,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Completed",
      value: "12",
      icon: CheckCircle,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StorytellerStats;
