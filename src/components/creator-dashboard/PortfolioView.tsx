
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star } from 'lucide-react';

interface PortfolioViewProps {
  onEditPortfolio: () => void;
}

const PortfolioView = ({ onEditPortfolio }: PortfolioViewProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
        <Button 
          onClick={onEditPortfolio}
          className="bg-black hover:bg-gray-800 text-white"
        >
          Edit Portfolio
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Portfolio Item {item}</h3>
              <p className="text-sm text-gray-600 mb-3">Sample description of the creative work showcased here.</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Action/Adventure</Badge>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">4.9</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortfolioView;
