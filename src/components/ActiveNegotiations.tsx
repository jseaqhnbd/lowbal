import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Clock, TrendingDown, Activity, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { NegotiationTab } from '../pages/App';
import { useToast } from "@/hooks/use-toast";

interface ActiveNegotiationsProps {
  negotiations: NegotiationTab[];
  onUpdateNegotiation: (tabId: string, updates: Partial<NegotiationTab>) => void;
  onContinueNegotiation: (negotiationId: string) => void;
}

const ActiveNegotiations: React.FC<ActiveNegotiationsProps> = ({ 
  negotiations, 
  onUpdateNegotiation,
  onContinueNegotiation
}) => {
  const { toast } = useToast();

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-gradient-to-r from-red-400 to-red-500';
    if (progress < 70) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-green-400 to-green-500';
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

  const handleContinueNegotiation = (negotiationId: string) => {
    onContinueNegotiation(negotiationId);
    toast({
      title: "Continuing Negotiation",
      description: "Opening your negotiation where you left off.",
    });
  };

  if (negotiations.length === 0) {
    return (
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
        <CardContent className="p-16 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-blue-500/30">
            <Activity className="w-16 h-16 text-blue-600" />
          </div>
          <h3 className="text-4xl font-black text-gray-900 mb-6">No Active Negotiations</h3>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Start a new negotiation to see your active deals here. Track progress, manage conversations, 
            and close deals with AI-powered assistance.
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-black px-12 py-6 rounded-2xl text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
            <MessageSquare className="w-6 h-6 mr-3" />
            Start New Negotiation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-white mb-6">Active Negotiations</h2>
        <p className="text-2xl text-gray-300 font-medium">Track your ongoing deals and their progress</p>
      </div>

      <div className="grid gap-8">
        {negotiations.map((negotiation) => (
          <Card key={negotiation.id} className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
            <CardContent className="p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start gap-6">
                  <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(negotiation.category)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 mb-3">
                      {negotiation.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-4 py-2 text-sm">
                        {negotiation.platform}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold px-4 py-2 text-sm capitalize">
                        {negotiation.category.replace('-', ' ')}
                      </Badge>
                      <Badge className={`font-bold text-white px-4 py-2 text-sm ${
                        negotiation.progress < 30 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        negotiation.progress < 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}>
                        {getProgressLabel(negotiation.progress)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-8 text-base text-gray-600">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Started {formatTimeAgo(negotiation.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Last activity {formatTimeAgo(negotiation.lastActivity)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">{negotiation.messages.length} messages</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-2 font-medium">Original Price</div>
                  <div className="text-xl font-bold text-gray-700 line-through mb-4">
                    ${negotiation.originalPrice.toLocaleString()}
                  </div>
                  {negotiation.currentOffer && (
                    <>
                      <div className="text-sm text-green-600 mb-2 font-medium">Current Offer</div>
                      <div className="text-3xl font-black text-green-600 mb-4">
                        ${negotiation.currentOffer.toLocaleString()}
                      </div>
                    </>
                  )}
                  {negotiation.maxBudget && (
                    <>
                      <div className="text-sm text-blue-600 mb-2 font-medium">Max Budget</div>
                      <div className="text-xl font-bold text-blue-600">
                        ${negotiation.maxBudget.toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-gray-800">Negotiation Progress</span>
                  <span className="text-lg font-black text-gray-900">{negotiation.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ease-out shadow-lg ${getProgressColor(negotiation.progress)}`}
                    style={{ width: `${negotiation.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Enhanced Savings Calculation */}
              {negotiation.currentOffer && (
                <div className="bg-gradient-to-r from-green-50 via-green-100 to-emerald-50 rounded-2xl p-6 mb-8 border-2 border-green-200 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingDown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-black text-green-800">Potential Savings</div>
                        <div className="text-sm text-green-600 font-medium">If deal closes at current offer</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-green-600">
                        ${(negotiation.originalPrice - negotiation.currentOffer).toLocaleString()}
                      </div>
                      <div className="text-lg text-green-600 font-bold">
                        {Math.round(((negotiation.originalPrice - negotiation.currentOffer) / negotiation.originalPrice) * 100)}% off
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Latest Message Preview */}
              {negotiation.messages.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <div className="text-lg font-bold text-gray-800">Latest Message</div>
                    <Badge className="bg-blue-100 text-blue-700 font-medium">
                      {negotiation.messages[negotiation.messages.length - 1].type === 'ai' ? 'AI' : 
                       negotiation.messages[negotiation.messages.length - 1].type === 'seller' ? 'Seller' : 'You'}
                    </Badge>
                  </div>
                  <div className="text-gray-800 text-base leading-relaxed font-medium">
                    {negotiation.messages[negotiation.messages.length - 1].content.substring(0, 200)}
                    {negotiation.messages[negotiation.messages.length - 1].content.length > 200 && '...'}
                  </div>
                  <div className="text-sm text-gray-500 mt-3 font-medium">
                    {formatTimeAgo(negotiation.messages[negotiation.messages.length - 1].timestamp)}
                  </div>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex gap-6">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white font-black h-14 rounded-2xl text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  onClick={() => handleContinueNegotiation(negotiation.id)}
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Continue Negotiation
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <Button 
                  variant="outline"
                  className="px-8 h-14 rounded-2xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  onClick={() => {
                    onUpdateNegotiation(negotiation.id, { 
                      progress: Math.min(negotiation.progress + 15, 100) 
                    });
                    toast({
                      title: "Progress Updated",
                      description: "Negotiation progress has been updated.",
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