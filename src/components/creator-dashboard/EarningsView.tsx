
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecentProject {
  id: number;
  title: string;
  client: string;
  budget: number;
  lastUpdate: string;
}

interface EarningsViewProps {
  projects: RecentProject[];
  onSetupPayout: () => void;
}

const EarningsView = ({ projects, onSetupPayout }: EarningsViewProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
        <Button 
          onClick={onSetupPayout}
          className="bg-black hover:bg-gray-800 text-white"
        >
          Setup Payouts
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$12,450</div>
            <p className="text-sm text-gray-600">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$2,850</div>
            <p className="text-sm text-gray-600">5 projects in review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$1,200</div>
            <p className="text-sm text-gray-600">Ready for withdrawal</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600">{project.client}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">+${project.budget.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{project.lastUpdate}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsView;
