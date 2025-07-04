import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, MessageSquare, Sparkles, Image, Bot, Settings } from "lucide-react";
import { NegotiationTab } from '../pages/App';
import CategorySelector from './CategorySelector';
import ListingForm from './ListingForm';
import ConversationImageAnalyzer from './ConversationImageAnalyzer';
import AITextChat from './AITextChat';
import { calculateCounterOffer, generateNegotiationMessage } from '../utils/negotiationUtils';
import { useToast } from "@/hooks/use-toast";

interface NegotiationTabsProps {
  tabs: NegotiationTab[];
  onUpdateTab: (tabId: string, updates: Partial<NegotiationTab>) => void;
  onCloseTab: (tabId: string) => void;
  onCreateNew: () => void;
}

const NegotiationTabs: React.FC<NegotiationTabsProps> = ({
  tabs,
  onUpdateTab,
  onCloseTab,
  onCreateNew
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const handleGenerateOffer = async (tab: NegotiationTab) => {
    if (!tab.title || !tab.originalPrice || !tab.platform || !tab.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const calculatedOffer = calculateCounterOffer(tab.originalPrice, tab.platform, tab.category);
      const message = await generateNegotiationMessage(
        tab.title, 
        tab.originalPrice, 
        calculatedOffer, 
        tab.platform, 
        '', 
        tab.category
      );
      
      onUpdateTab(tab.id, {
        currentOffer: calculatedOffer,
        messages: [
          ...tab.messages,
          {
            id: Date.now().toString(),
            type: 'ai',
            content: message,
            timestamp: new Date()
          }
        ]
      });
      
      toast({
        title: "Offer Generated!",
        description: "Your negotiation strategy is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (tabs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-emerald-500/30">
          <MessageSquare className="w-12 h-12 text-emerald-400" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-6">Start Your First Negotiation</h3>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Create a new negotiation tab to begin saving money with AI-powered strategies. 
          Use our advanced tools to analyze conversations and get perfect responses.
        </p>
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-semibold text-lg px-12 py-6 rounded-2xl shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 border-0"
        >
          <Plus className="w-6 h-6 mr-3" />
          Create New Negotiation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Tab Navigation */}
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20">
        <div className="flex items-center gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 min-w-0 group ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg scale-105'
                  : 'hover:bg-white/10 text-gray-300 hover:text-white hover:scale-102'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={`w-3 h-3 rounded-full ${
                tab.status === 'active' 
                  ? 'bg-emerald-400 animate-pulse' 
                  : 'bg-gray-400'
              }`} />
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold truncate max-w-32 text-sm">
                  {tab.title || 'New Negotiation'}
                </div>
                {tab.category && (
                  <div className={`text-xs truncate font-medium ${
                    activeTab === tab.id ? 'text-white/80' : 'text-gray-400'
                  }`}>
                    {tab.category.replace('-', ' ')}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`h-8 w-8 p-0 flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'hover:bg-white/20 text-white' 
                    : 'hover:bg-red-100 text-red-500'
                }`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            onClick={onCreateNew}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-12 w-12 rounded-2xl hover:bg-emerald-500/20 text-emerald-400 hover:scale-110 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Active Tab Content */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={activeTab === tab.id ? 'block' : 'hidden'}
        >
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Category Selection with Change Option */}
                <div className="text-center">
                  {!tab.category ? (
                    <div className="inline-flex items-center gap-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl text-emerald-300 px-8 py-4 rounded-full text-lg font-semibold mb-8 border border-emerald-500/30">
                      <Sparkles className="w-5 h-5" />
                      Step 1: Choose Your Category
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="inline-flex items-center gap-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl text-emerald-300 px-8 py-4 rounded-full text-lg font-semibold border border-emerald-500/30">
                        <Sparkles className="w-5 h-5" />
                        Category: {tab.category.charAt(0).toUpperCase() + tab.category.slice(1).replace('-', ' ')}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => onUpdateTab(tab.id, { category: '' })}
                        className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60 font-semibold px-6 py-3 rounded-xl text-sm shadow-lg backdrop-blur-sm"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Change Category
                      </Button>
                    </div>
                  )}
                  
                  {!tab.category && (
                    <CategorySelector
                      selectedCategory={tab.category}
                      onCategorySelect={(category) => 
                        onUpdateTab(tab.id, { category })
                      }
                    />
                  )}
                </div>

                {/* Main Interface */}
                {tab.category && (
                  <div className="space-y-8">
                    {/* Enhanced Sub-tabs - Smaller and Separate */}
                    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/30 backdrop-blur-xl shadow-xl rounded-xl p-2 h-12 border border-white/20">
                        <TabsTrigger 
                          value="form" 
                          className="text-sm font-semibold h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Manual Entry
                        </TabsTrigger>
                        <TabsTrigger 
                          value="image" 
                          className="text-sm font-semibold h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Image Analyzer
                        </TabsTrigger>
                        <TabsTrigger 
                          value="ai-chat" 
                          className="text-sm font-semibold h-8 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          AI Assistant
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="form" className="space-y-8">
                        <div className="grid lg:grid-cols-2 gap-8">
                          <div>
                            <ListingForm
                              listingTitle={tab.title}
                              setListingTitle={(title) => onUpdateTab(tab.id, { title })}
                              listingPrice={tab.originalPrice.toString()}
                              setListingPrice={(price) => onUpdateTab(tab.id, { originalPrice: parseFloat(price) || 0 })}
                              maxBudget={tab.maxBudget?.toString() || ''}
                              setMaxBudget={(budget) => onUpdateTab(tab.id, { maxBudget: parseFloat(budget) || undefined })}
                              platform={tab.platform}
                              setPlatform={(platform) => onUpdateTab(tab.id, { platform })}
                              extraNotes=""
                              setExtraNotes={() => {}}
                              isLoading={isLoading}
                              onGenerateOffer={() => handleGenerateOffer(tab)}
                              selectedCategory={tab.category}
                            />
                          </div>
                          <div>
                            <AITextChat
                              selectedCategory={tab.category}
                              negotiationData={{
                                title: tab.title,
                                originalPrice: tab.originalPrice,
                                currentOffer: tab.currentOffer,
                                maxBudget: tab.maxBudget,
                                platform: tab.platform
                              }}
                              messages={tab.messages}
                              onUpdateMessages={(messages) => onUpdateTab(tab.id, { messages })}
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="image" className="space-y-8">
                        <ConversationImageAnalyzer selectedCategory={tab.category} />
                      </TabsContent>

                      <TabsContent value="ai-chat" className="space-y-8">
                        <AITextChat
                          selectedCategory={tab.category}
                          negotiationData={{
                            title: tab.title,
                            originalPrice: tab.originalPrice,
                            currentOffer: tab.currentOffer,
                            maxBudget: tab.maxBudget,
                            platform: tab.platform
                          }}
                          messages={tab.messages}
                          onUpdateMessages={(messages) => onUpdateTab(tab.id, { messages })}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default NegotiationTabs;