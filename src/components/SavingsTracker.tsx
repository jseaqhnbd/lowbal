import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, Award } from "lucide-react";

interface SavingsTrackerProps {
  totalSavings: number;
  totalDeals: number;
  averageSavings: number;
}

const SavingsTracker: React.FC<SavingsTrackerProps> = ({
  totalSavings,
  totalDeals,
  averageSavings
}) => {
  const progressToNextMilestone = () => {
    const milestones = [1000, 2500, 5000, 10000, 25000, 50000];
    const nextMilestone = milestones.find(m => m > totalSavings) || 100000;
    const progress = (totalSavings / nextMilestone) * 100;
    return { nextMilestone, progress };
  };

  const { nextMilestone, progress } = progressToNextMilestone();

  return (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-blue-600 py-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-2 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 right-10 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${totalSavings.toLocaleString()}
              </div>
              <div className="text-white/80 font-medium">Total Saved</div>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {totalDeals}
              </div>
              <div className="text-white/80 font-medium">Deals Closed</div>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${averageSavings}
              </div>
              <div className="text-white/80 font-medium">Avg. Savings</div>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Next Milestone</div>
                  <div className="text-white/80 text-sm">${nextMilestone.toLocaleString()}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/80">
                  <span>${totalSavings.toLocaleString()}</span>
                  <span>${nextMilestone.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="text-center text-white/80 text-sm">
                  {Math.round(progress)}% to next milestone
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SavingsTracker;