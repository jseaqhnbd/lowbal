import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Clock, TrendingDown, Activity, Calendar, DollarSign } from "lucide-react";
import { NegotiationTab } from '../pages/App';

interface ActiveNegotiationsProps {
  negotiations: NegotiationTab[];
  onUpdateNegotiation: (tabId: string, updates: Partial<NegotiationTab>) => void;
}

const ActiveNegotiations: React.FC<ActiveNegotiationsProps> = ({ 
  negotiations, 
  onUpdateNegotiation 
}) => {
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressLabel = (progress: number) => {
    if (progress < 30) return 'Early Stage';
    if (progress < 70) return 'In Progress';
    return 'Near Completion';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'cars': '🚗',
      'electronics': '💻',
      'furniture': '🪑',
      'real-estate': '🏠',
      'motorcycles': '🏍️',
      'gadgets': '📱'
    };
    return icons[category as keyof typeof icons] || '📦';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (negotiations.length === 0) {
    return (
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
        <CardContent className="p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Activity className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">No Active Negotiations</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Start a new negotiation to see your active deals here. Track progress and manage conversations in real-time.
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg">
            Start New Negotiation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">Active Negotiations</h2>
        <p className="text-xl text-gray-300">Track your ongoing deals and their progress</p>
      </div>

      <div className="grid gap-6">
        {negotiations.map((negotiation) => (
          <Card key={negotiation.id} className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {getCategoryIcon(negotiation.category)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {negotiation.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <Badge className="bg-blue-100 text-blue-700 font-bold">
                        {negotiation.platform}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 font-bold capitalize">
                        {negotiation.category.replace('-', ' ')}
                      </Badge>
                      <Badge className={`font-bold text-white ${
                        negotiation.progress < 30 ? 'bg-red-500' :
                        negotiation.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {getProgressLabel(negotiation.progress)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Started {formatTimeAgo(negotiation.createdAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Last activity {formatTimeAgo(negotiation.lastActivity)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {negotiation.messages.length} messages
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Original Price</div>
                  <div className="text-lg font-semibold text-gray-700 line-through mb-2">
                    ${negotiation.originalPrice.toLocaleString()}
                  </div>
                  {negotiation.currentOffer && (
                    <>
                      <div className="text-sm text-green-600 mb-1">Current Offer</div>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        ${negotiation.currentOffer.toLocaleString()}
                      </div>
                    </>
                  )}
                  {negotiation.maxBudget && (
                    <>
                      <div className="text-sm text-blue-600 mb-1">Max Budget</div>
                      <div className="text-lg font-semibold text-blue-600">
                        ${negotiation.maxBudget.toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Negotiation Progress</span>
                  <span className="text-sm font-bold text-gray-900">{negotiation.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(negotiation.progress)}`}
                    style={{ width: `${negotiation.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Savings Calculation */}
              {negotiation.currentOffer && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 mb-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-800">Potential Savings</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${(negotiation.originalPrice - negotiation.currentOffer).toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">
                        {Math.round(((negotiation.originalPrice - negotiation.currentOffer) / negotiation.originalPrice) * 100)}% off
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Latest Message Preview */}
              {negotiation.messages.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Latest Message</div>
                  <div className="text-gray-800 text-sm leading-relaxed">
                    {negotiation.messages[negotiation.messages.length - 1].content.substring(0, 150)}
                    {negotiation.messages[negotiation.messages.length - 1].content.length > 150 && '...'}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {formatTimeAgo(negotiation.messages[negotiation.messages.length - 1].timestamp)}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold h-12 rounded-xl"
                  onClick={() => {
                    // This would open the negotiation in the main tab
                    console.log('Continue negotiation:', negotiation.id);
                  }}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Continue Negotiation
                </Button>
                <Button 
                  variant="outline"
                  className="px-6 h-12 rounded-xl border-2 font-bold"
                  onClick={() => {
                    // This would update the progress
                    onUpdateNegotiation(negotiation.id, { 
                      progress: Math.min(negotiation.progress + 10, 100) 
                    });
                  }}
                >
                  Update Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveNegotiations;