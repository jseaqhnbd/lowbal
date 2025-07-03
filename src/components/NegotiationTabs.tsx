import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, MessageSquare, Sparkles, Send, Link, Image, Bot } from "lucide-react";
import { NegotiationTab } from '../pages/App';
import CategorySelector from './CategorySelector';
import ListingForm from './ListingForm';
import NegotiationResults from './NegotiationResults';
import AIConversationChat from './AIConversationChat';
import ListingUrlParser from './ListingUrlParser';
import ConversationImageAnalyzer from './ConversationImageAnalyzer';
import BetterDeals from './BetterDeals';
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

  const handleListingParsed = (tabId: string, data: {
    title: string;
    price: string;
    platform: string;
    description?: string;
  }) => {
    onUpdateTab(tabId, {
      title: data.title,
      originalPrice: parseFloat(data.price) || 0,
      platform: data.platform
    });
    setActiveSubTab('form');
  };

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
      <div className="text-center py-20">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-emerald-500/30">
          <MessageSquare className="w-16 h-16 text-emerald-400" />
        </div>
        <h3 className="text-5xl font-black text-white mb-8">Start Your First Negotiation</h3>
        <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Create a new negotiation tab to begin saving money with AI-powered strategies. 
          Use our advanced tools to parse listings, analyze conversations, and get perfect responses.
        </p>
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white font-black text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 border-0"
        >
          <Plus className="w-8 h-8 mr-4" />
          Create New Negotiation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Tab Navigation */}
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/20">
        <div className="flex items-center gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-4 px-8 py-6 rounded-2xl cursor-pointer transition-all duration-300 min-w-0 group ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-2xl scale-105'
                  : 'hover:bg-white/10 text-gray-300 hover:text-white hover:scale-102'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={`w-4 h-4 rounded-full ${
                tab.status === 'active' 
                  ? 'bg-emerald-400 animate-pulse' 
                  : 'bg-gray-400'
              }`} />
              <MessageSquare className="w-6 h-6 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-black truncate max-w-32 text-lg">
                  {tab.title || 'New Negotiation'}
                </div>
                {tab.category && (
                  <div className={`text-sm truncate font-medium ${
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
                className={`h-10 w-10 p-0 flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'hover:bg-white/20 text-white' 
                    : 'hover:bg-red-100 text-red-500'
                }`}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          ))}
          <Button
            onClick={onCreateNew}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-14 w-14 rounded-2xl hover:bg-emerald-500/20 text-emerald-400 hover:scale-110 transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
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
            <CardContent className="p-12">
              <div className="space-y-12">
                {/* Category Selection */}
                {!tab.category && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl text-emerald-300 px-8 py-4 rounded-full text-lg font-bold mb-10 border border-emerald-500/30">
                      <Sparkles className="w-6 h-6" />
                      Step 1: Choose Your Category
                    </div>
                    <CategorySelector
                      selectedCategory={tab.category}
                      onCategorySelect={(category) => 
                        onUpdateTab(tab.id, { category })
                      }
                    />
                  </div>
                )}

                {/* Main Interface */}
                {tab.category && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl text-emerald-300 px-8 py-4 rounded-full text-lg font-bold mb-8 border border-emerald-500/30">
                        <Sparkles className="w-6 h-6" />
                        Category: {tab.category.charAt(0).toUpperCase() + tab.category.slice(1).replace('-', ' ')}
                      </div>
                    </div>

                    {/* Enhanced Sub-tabs */}
                    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-10 bg-black/30 backdrop-blur-xl shadow-2xl rounded-3xl p-4 h-20 border border-white/20">
                        <TabsTrigger 
                          value="form" 
                          className="text-lg font-bold h-14 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Sparkles className="w-5 h-5 mr-3" />
                          Manual Entry
                        </TabsTrigger>
                        <TabsTrigger 
                          value="url" 
                          className="text-lg font-bold h-14 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Link className="w-5 h-5 mr-3" />
                          URL Parser
                        </TabsTrigger>
                        <TabsTrigger 
                          value="chat" 
                          className="text-lg font-bold h-14 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Bot className="w-5 h-5 mr-3" />
                          AI Chat
                        </TabsTrigger>
                        <TabsTrigger 
                          value="image" 
                          className="text-lg font-bold h-14 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-white hover:text-white hover:bg-white/10"
                        >
                          <Image className="w-5 h-5 mr-3" />
                          Image Analyzer
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="form" className="space-y-10">
                        <div className="grid lg:grid-cols-3 gap-10">
                          <ListingForm
                            listingTitle={tab.title}
                            setListingTitle={(title) => onUpdateTab(tab.id, { title })}
                            listingPrice={tab.originalPrice.toString()}
                            setListingPrice={(price) => onUpdateTab(tab.id, { originalPrice: parseFloat(price) || 0 })}
                            platform={tab.platform}
                            setPlatform={(platform) => onUpdateTab(tab.id, { platform })}
                            extraNotes=""
                            setExtraNotes={() => {}}
                            isLoading={isLoading}
                            onGenerateOffer={() => handleGenerateOffer(tab)}
                            selectedCategory={tab.category}
                          />

                          <NegotiationResults
                            counterOffer={tab.currentOffer?.toString() || ''}
                            negotiationMessage={tab.messages.find(m => m.type === 'ai')?.content || ''}
                            listingPrice={tab.originalPrice.toString()}
                            onCopyToClipboard={(text) => {
                              navigator.clipboard.writeText(text);
                              toast({
                                title: "Copied!",
                                description: "Message copied to clipboard.",
                              });
                            }}
                            selectedCategory={tab.category}
                          />

                          <BetterDeals
                            searchQuery={tab.title}
                            category={tab.category}
                            currentPrice={tab.originalPrice}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="url" className="space-y-10">
                        <div className="max-w-5xl mx-auto">
                          <ListingUrlParser 
                            onListingParsed={(data) => handleListingParsed(tab.id, data)}
                          />
                          
                          {(tab.title || tab.originalPrice > 0) && (
                            <div className="mt-10 grid lg:grid-cols-3 gap-10">
                              <ListingForm
                                listingTitle={tab.title}
                                setListingTitle={(title) => onUpdateTab(tab.id, { title })}
                                listingPrice={tab.originalPrice.toString()}
                                setListingPrice={(price) => onUpdateTab(tab.id, { originalPrice: parseFloat(price) || 0 })}
                                platform={tab.platform}
                                setPlatform={(platform) => onUpdateTab(tab.id, { platform })}
                                extraNotes=""
                                setExtraNotes={() => {}}
                                isLoading={isLoading}
                                onGenerateOffer={() => handleGenerateOffer(tab)}
                                selectedCategory={tab.category}
                              />

                              <NegotiationResults
                                counterOffer={tab.currentOffer?.toString() || ''}
                                negotiationMessage={tab.messages.find(m => m.type === 'ai')?.content || ''}
                                listingPrice={tab.originalPrice.toString()}
                                onCopyToClipboard={(text) => {
                                  navigator.clipboard.writeText(text);
                                  toast({
                                    title: "Copied!",
                                    description: "Message copied to clipboard.",
                                  });
                                }}
                                selectedCategory={tab.category}
                              />

                              <BetterDeals
                                searchQuery={tab.title}
                                category={tab.category}
                                currentPrice={tab.originalPrice}
                              />
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="chat" className="space-y-10">
                        <AIConversationChat selectedCategory={tab.category} />
                      </TabsContent>

                      <TabsContent value="image" className="space-y-10">
                        <ConversationImageAnalyzer selectedCategory={tab.category} />
                      </TabsContent>
                    </Tabs>

                    {/* Enhanced Chat Interface */}
                    {tab.currentOffer && activeSubTab === 'form' && (
                      <div className="border-t-2 border-white/10 pt-12">
                        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-10 border border-emerald-500/20">
                          <h3 className="text-4xl font-black text-white mb-10 flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                              <MessageSquare className="w-8 h-8 text-white" />
                            </div>
                            Live Negotiation Thread
                            <div className="flex items-center gap-3 bg-emerald-500/20 backdrop-blur-xl text-emerald-300 px-6 py-3 rounded-full text-lg font-bold border border-emerald-500/30">
                              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                              Active
                            </div>
                          </h3>
                          
                          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 max-h-96 overflow-y-auto mb-8 shadow-2xl border border-white/20">
                            {tab.messages.length === 0 ? (
                              <div className="text-center py-16 text-gray-400">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                                  <MessageSquare className="w-10 h-10 text-gray-300" />
                                </div>
                                <h4 className="text-2xl font-black text-white mb-4">Ready to Start Negotiating</h4>
                                <p className="text-gray-300 max-w-md mx-auto text-lg font-medium">
                                  Your AI-generated message is ready. Copy it and send to the seller, then paste their response here to continue the conversation.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-8">
                                {tab.messages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex gap-6 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                  >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl ${
                                      message.type === 'ai' 
                                        ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' 
                                        : message.type === 'seller'
                                        ? 'bg-gradient-to-br from-orange-500 to-red-500'
                                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                                    }`}>
                                      <span className="text-white font-black text-lg">
                                        {message.type === 'ai' ? 'AI' : message.type === 'seller' ? 'S' : 'U'}
                                      </span>
                                    </div>
                                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                      <div className={`inline-block p-8 rounded-3xl max-w-[85%] shadow-2xl ${
                                        message.type === 'ai'
                                          ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border border-emerald-500/30 text-white'
                                          : message.type === 'seller'
                                          ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-500/30 text-white'
                                          : 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 backdrop-blur-xl border border-gray-500/30 text-white'
                                      }`}>
                                        <p className="text-lg leading-relaxed font-medium">{message.content}</p>
                                        {message.type === 'ai' && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              navigator.clipboard.writeText(message.content);
                                              toast({
                                                title: "Copied!",
                                                description: "AI message copied to clipboard.",
                                              });
                                            }}
                                            className="mt-4 text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/20 font-bold"
                                          >
                                            <MessageSquare className="w-5 h-5 mr-2" />
                                            Copy Message
                                          </Button>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-400 mt-3 font-medium">
                                        {message.timestamp.toLocaleTimeString()} • {message.timestamp.toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-6">
                            <input
                              type="text"
                              placeholder="Paste the seller's response here or type your message..."
                              className="flex-1 px-8 py-6 border-2 border-white/20 rounded-2xl focus:border-emerald-400 transition-colors text-lg bg-black/20 backdrop-blur-xl text-white placeholder:text-gray-400 font-medium"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                  const content = e.currentTarget.value.trim();
                                  onUpdateTab(tab.id, {
                                    messages: [
                                      ...tab.messages,
                                      {
                                        id: Date.now().toString(),
                                        type: 'user',
                                        content,
                                        timestamp: new Date()
                                      }
                                    ]
                                  });
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-10 py-6 text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 rounded-2xl font-bold">
                              <Send className="w-6 h-6" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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