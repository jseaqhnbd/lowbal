import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import AppHeader from '../components/AppHeader';
import NegotiationTabs from '../components/NegotiationTabs';
import ActiveNegotiations from '../components/ActiveNegotiations';
import OrderHistory from '../components/OrderHistory';
import SavingsTracker from '../components/SavingsTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Activity, History, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackgroundLayout from '../components/shared/BackgroundLayout';

export interface NegotiationTab {
  id: string;
  title: string;
  category: string;
  platform: string;
  originalPrice: number;
  maxBudget?: number;
  currentOffer?: number;
  status: 'active' | 'completed' | 'closed';
  createdAt: Date;
  lastActivity: Date;
  progress: number; // 0-100 percentage
  messages: Array<{
    id: string;
    type: 'user' | 'ai' | 'seller';
    content: string;
    timestamp: Date;
    isAudio?: boolean;
    hasImage?: boolean;
  }>;
}

export interface CompletedDeal {
  id: string;
  title: string;
  category: string;
  platform: string;
  originalPrice: number;
  finalPrice: number;
  savings: number;
  savingsPercentage: number;
  completedAt: Date;
  dealClosed: boolean;
}

const AppPage = () => {
  const [activeMainTab, setActiveMainTab] = useState('negotiate');
  const [negotiationTabs, setNegotiationTabs] = useState<NegotiationTab[]>([
    {
      id: '1',
      title: '2020 MacBook Pro 13"',
      category: 'electronics',
      platform: 'Facebook Marketplace',
      originalPrice: 1200,
      maxBudget: 950,
      currentOffer: 900,
      status: 'active',
      createdAt: new Date('2024-01-20'),
      lastActivity: new Date('2024-01-22'),
      progress: 65,
      messages: [
        {
          id: '1',
          type: 'ai',
          content: 'Hi! I\'m very interested in your MacBook Pro 13". I\'ve been looking for this exact model and I\'m ready to purchase today. Based on current market prices, would you consider $900? I can pick it up immediately with cash if we can agree on this price.',
          timestamp: new Date('2024-01-20T10:00:00')
        },
        {
          id: '2',
          type: 'seller',
          content: 'Thanks for your interest! The laptop is in excellent condition with original packaging. I could do $1000 for a quick sale.',
          timestamp: new Date('2024-01-21T14:30:00')
        }
      ]
    },
    {
      id: '2',
      title: '2019 Honda Civic',
      category: 'cars',
      platform: 'Craigslist',
      originalPrice: 18000,
      maxBudget: 16000,
      currentOffer: 15500,
      status: 'active',
      createdAt: new Date('2024-01-18'),
      lastActivity: new Date('2024-01-21'),
      progress: 40,
      messages: [
        {
          id: '1',
          type: 'ai',
          content: 'Hi! I\'m very interested in your 2019 Honda Civic. I\'ve been looking for exactly this model and I\'m ready to purchase immediately. Based on current market values and the condition, would you consider $15,500? I can come see it this week and complete the purchase with financing.',
          timestamp: new Date('2024-01-18T09:00:00')
        }
      ]
    }
  ]);
  const [completedDeals, setCompletedDeals] = useState<CompletedDeal[]>([
    {
      id: '1',
      title: '2019 Honda Civic',
      category: 'cars',
      platform: 'Facebook Marketplace',
      originalPrice: 18000,
      finalPrice: 15500,
      savings: 2500,
      savingsPercentage: 14,
      completedAt: new Date('2024-01-15'),
      dealClosed: true
    },
    {
      id: '2',
      title: 'MacBook Pro 13"',
      category: 'electronics',
      platform: 'Craigslist',
      originalPrice: 1200,
      finalPrice: 950,
      savings: 250,
      savingsPercentage: 21,
      completedAt: new Date('2024-01-10'),
      dealClosed: true
    },
    {
      id: '3',
      title: 'Vintage Dining Set',
      category: 'furniture',
      platform: 'Facebook Marketplace',
      originalPrice: 800,
      finalPrice: 550,
      savings: 250,
      savingsPercentage: 31,
      completedAt: new Date('2024-01-05'),
      dealClosed: true
    }
  ]);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [closingTabId, setClosingTabId] = useState<string>('');
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState('');
  const { toast } = useToast();

  const createNewNegotiation = () => {
    const newTab: NegotiationTab = {
      id: Date.now().toString(),
      title: 'New Negotiation',
      category: '',
      platform: '',
      originalPrice: 0,
      status: 'active',
      createdAt: new Date(),
      lastActivity: new Date(),
      progress: 0,
      messages: []
    };
    
    setNegotiationTabs(prev => [...prev, newTab]);
    setActiveMainTab('negotiate');
    
    toast({
      title: "New Negotiation Started",
      description: "A new negotiation tab has been created.",
    });
  };

  const updateNegotiationTab = (tabId: string, updates: Partial<NegotiationTab>) => {
    setNegotiationTabs(prev => 
      prev.map(tab => 
        tab.id === tabId ? { ...tab, ...updates, lastActivity: new Date() } : tab
      )
    );
  };

  const closeNegotiationTab = (tabId: string) => {
    const tab = negotiationTabs.find(t => t.id === tabId);
    if (!tab) return;

    setClosingTabId(tabId);
    setShowDealDialog(true);
  };

  const handleDealCompletion = () => {
    const tab = negotiationTabs.find(t => t.id === closingTabId);
    if (!tab) return;

    if (dealClosed && finalPrice) {
      const finalPriceNum = parseFloat(finalPrice);
      if (finalPriceNum && finalPriceNum < tab.originalPrice) {
        const savings = tab.originalPrice - finalPriceNum;
        const savingsPercentage = Math.round((savings / tab.originalPrice) * 100);
        
        const completedDeal: CompletedDeal = {
          id: closingTabId,
          title: tab.title,
          category: tab.category,
          platform: tab.platform,
          originalPrice: tab.originalPrice,
          finalPrice: finalPriceNum,
          savings,
          savingsPercentage,
          completedAt: new Date(),
          dealClosed: true
        };
        
        setCompletedDeals(prev => [completedDeal, ...prev]);
        
        toast({
          title: "Deal Completed! 🎉",
          description: `You saved $${savings} (${savingsPercentage}% off)!`,
        });
      }
    }
    
    setNegotiationTabs(prev => prev.filter(t => t.id !== closingTabId));
    setShowDealDialog(false);
    setClosingTabId('');
    setDealClosed(false);
    setFinalPrice('');
  };

  const totalSavings = completedDeals.reduce((sum, deal) => sum + deal.savings, 0);
  const totalDeals = completedDeals.length;
  const averageSavings = totalDeals > 0 ? Math.round(totalSavings / totalDeals) : 0;
  const activeNegotiationsCount = negotiationTabs.filter(tab => tab.status === 'active').length;

  const tabsConfig = [
    { value: 'negotiate', label: 'Negotiate', icon: MessageSquare, count: negotiationTabs.length, gradient: 'from-emerald-500 to-cyan-500' },
    { value: 'active', label: 'Active Deals', icon: Activity, count: activeNegotiationsCount, gradient: 'from-cyan-500 to-blue-500' },
    { value: 'history', label: 'History', icon: History, count: totalDeals, gradient: 'from-blue-500 to-purple-500' },
    { value: 'analytics', label: 'Analytics', icon: TrendingUp, gradient: 'from-purple-500 to-pink-500' }
  ];

  return (
    <BackgroundLayout>
      <AppHeader />

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={createNewNegotiation}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 border-0"
        >
          <Plus className="w-10 h-10 text-white" />
        </Button>
      </div>

      {/* Enhanced Savings Tracker */}
      <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-2 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl rounded-2xl p-6 text-center border">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${totalSavings.toLocaleString()}
              </div>
              <div className="text-white/80 font-medium">Total Saved</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl rounded-2xl p-6 text-center border">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {activeNegotiationsCount}
              </div>
              <div className="text-white/80 font-medium">Active Deals</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl rounded-2xl p-6 text-center border">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <History className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {totalDeals}
              </div>
              <div className="text-white/80 font-medium">Completed</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl rounded-2xl p-6 text-center border">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${averageSavings}
              </div>
              <div className="text-white/80 font-medium">Avg. Savings</div>
            </div>

            <div className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl rounded-2xl p-6 text-center border">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {totalDeals > 0 ? Math.round((completedDeals.reduce((sum, deal) => sum + deal.savingsPercentage, 0) / totalDeals)) : 0}%
              </div>
              <div className="text-white/80 font-medium">Avg. Discount</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-black/20 backdrop-blur-xl shadow-2xl rounded-3xl p-3 h-24 border border-white/20">
            {tabsConfig.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={`text-lg font-bold h-18 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white flex flex-col items-center gap-1`}
              >
                <tab.icon className="w-6 h-6" />
                <div className="flex items-center gap-2">
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full font-bold">
                      {tab.count}
                    </span>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="negotiate" className="space-y-8">
            <NegotiationTabs
              tabs={negotiationTabs}
              onUpdateTab={updateNegotiationTab}
              onCloseTab={closeNegotiationTab}
              onCreateNew={createNewNegotiation}
            />
          </TabsContent>

          <TabsContent value="active">
            <ActiveNegotiations 
              negotiations={negotiationTabs.filter(tab => tab.status === 'active')}
              onUpdateNegotiation={updateNegotiationTab}
            />
          </TabsContent>

          <TabsContent value="history">
            <OrderHistory deals={completedDeals} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-3xl font-black text-white mb-8">Savings Analytics</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30">
                    <span className="text-emerald-300 font-bold text-lg">Total Saved</span>
                    <span className="text-3xl font-black text-emerald-400">${totalSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl border border-cyan-500/30">
                    <span className="text-cyan-300 font-bold text-lg">Deals Completed</span>
                    <span className="text-3xl font-black text-cyan-400">{totalDeals}</span>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/30">
                    <span className="text-blue-300 font-bold text-lg">Average Savings</span>
                    <span className="text-3xl font-black text-blue-400">${averageSavings}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-3xl font-black text-white mb-8">Category Breakdown</h3>
                <div className="space-y-4">
                  {['cars', 'electronics', 'furniture'].map(category => {
                    const categoryDeals = completedDeals.filter(deal => deal.category === category);
                    const categorySavings = categoryDeals.reduce((sum, deal) => sum + deal.savings, 0);
                    return (
                      <div key={category} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                        <span className="capitalize font-bold text-white text-lg">{category}</span>
                        <div className="text-right">
                          <div className="font-black text-emerald-400 text-xl">${categorySavings}</div>
                          <div className="text-sm text-gray-300 font-medium">{categoryDeals.length} deals</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Deal Completion Dialog */}
      <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
        <DialogContent className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 mb-2">
              Deal Completion
            </DialogTitle>
            <DialogDescription className="text-gray-700 font-medium">
              Did you successfully close this deal?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="flex gap-4">
              <Button
                onClick={() => setDealClosed(true)}
                className={`flex-1 h-12 rounded-xl font-bold transition-all duration-300 ${
                  dealClosed 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yes, Deal Closed! 🎉
              </Button>
              <Button
                onClick={() => setDealClosed(false)}
                className={`flex-1 h-12 rounded-xl font-bold transition-all duration-300 ${
                  !dealClosed 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                No, Just Closing
              </Button>
            </div>

            {dealClosed && (
              <div className="space-y-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                <Label htmlFor="finalPrice" className="text-lg font-bold text-green-800">
                  What was the final price?
                </Label>
                <Input
                  id="finalPrice"
                  type="number"
                  placeholder="Enter final price"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  className="h-12 text-lg border-2 border-green-300 focus:border-green-500 bg-white text-gray-900 font-bold"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setShowDealDialog(false)}
                variant="outline"
                className="flex-1 h-12 rounded-xl font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDealCompletion}
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </BackgroundLayout>
  );
};

export default AppPage;