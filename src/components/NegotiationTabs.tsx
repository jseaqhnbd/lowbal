import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, MessageSquare, Sparkles, Image, Bot, Settings } from "lucide-react";
import { NegotiationTab } from '../pages/App';
import CategorySelector from './CategorySelector';
import ListingForm from './ListingForm';
import ConversationalAI from './ConversationalAI';
import ConversationImageAnalyzer from './ConversationImageAnalyzer';
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
      <div className="text-center py-24">
        <div className="w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-12 shadow-2xl border border-emerald-500/30">
          <MessageSquare className="w-20 h-20 text-emerald-400" />
        </div>
        <h3 className="text-6xl font-black text-white mb-10">Start Your First Negotiation</h3>
        <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
          Create a new negotiation tab to begin saving money with AI-powered strategies. 
          Use our advanced tools to analyze conversations and get perfect responses.
        </p>
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-black text-2xl px-20 py-10 rounded-3xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 border-0"
        >
          <Plus className="w-10 h-10 mr-4" />
          Create New Negotiation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Enhanced Tab Navigation */}
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-6 px-10 py-8 rounded-3xl cursor-pointer transition-all duration-300 min-w-0 group ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-2xl scale-105'
                  : 'hover:bg-white/10 text-gray-300 hover:text-white hover:scale-102'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={`w-5 h-5 rounded-full ${
                tab.status === 'active' 
                  ? 'bg-emerald-400 animate-pulse' 
                  : 'bg-gray-400'
              }`} />
              <MessageSquare className="w-8 h-8 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-black truncate max-w-40 text-xl">
                  {tab.title || 'New Negotiation'}
                </div>
                {tab.category && (
                  <div className={`text-base truncate font-bold ${
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
                className={`h-12 w-12 p-0 flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'hover:bg-white/20 text-white' 
                    : 'hover:bg-red-100 text-red-500'
                }`}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          ))}
          <Button
            onClick={onCreateNew}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-16 w-16 rounded-3xl hover:bg-emerald-500/20 text-emerald-400 hover:scale-110 transition-all duration-300"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {/* Active Tab Content */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={activeTab === tab.id ? 'block' : 'hidden'}
        >
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            <CardContent className="p-16">
              <div className="space-y-16">
                {/* Category Selection with Change Option */}
                <div className="text-center">
                  {!tab.category ? (
                    <div className="inline-flex items-center gap-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl text-emerald-300 px-12 py-6 rounded-full text-2xl font-black mb-16 border border-emerald-500/30">
                      <Sparkles className="w-8 h-8" />
                      Step 1: Choose Your Category
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-6 mb-16">
                      <div className="inline-flex items-center gap-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl text-emerald-300 px-12 py-6 rounded-full text-2xl font-black border border-emerald-500/30">
                        <Sparkles className="w-8 h-8" />
                        Category: {tab.category.charAt(0).toUpperCase() + tab.category.slice(1).replace('-', ' ')}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => onUpdateTab(tab.id, { category: '' })}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-black px-8 py-6 rounded-2xl text-lg"
                      >
                        <Settings className="w-5 h-5 mr-3" />
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
                  <div className="space-y-12">
                    {/* Enhanced Sub-tabs - Reordered */}
                    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-16 bg-black/30 backdrop-blur-xl shadow-2xl rounded-3xl p-6 h-24 border border-white/20">
                        <TabsTrigger 
                          value="form" 
                          className="text-xl font-black h-16 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Sparkles className="w-6 h-6 mr-3" />
                          Manual Entry
                        </TabsTrigger>
                        <TabsTrigger 
                          value="image" 
                          className="text-xl font-black h-16 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Image className="w-6 h-6 mr-3" />
                          Image Analyzer
                        </TabsTrigger>
                        <TabsTrigger 
                          value="ai-chat" 
                          className="text-xl font-black h-16 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Bot className="w-6 h-6 mr-3" />
                          AI Assistant
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="form" className="space-y-12">
                        <div className="max-w-4xl mx-auto">
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
                      </TabsContent>

                      <TabsContent value="image" className="space-y-12">
                        <ConversationImageAnalyzer selectedCategory={tab.category} />
                      </TabsContent>

                      <TabsContent value="ai-chat" className="space-y-12">
                        <ConversationalAI
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