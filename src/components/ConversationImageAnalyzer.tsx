import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, Sparkles, Eye, MessageSquare, TrendingDown, Camera, FileImage, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConversationImageAnalyzerProps {
  selectedCategory: string;
}

interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  keyPoints: string[];
  suggestedResponse: string;
  negotiationTips: string[];
  priceAnalysis?: {
    mentionedPrice?: string;
    priceFlexibility: 'high' | 'medium' | 'low';
  };
  urgencyLevel: 'high' | 'medium' | 'low';
  sellerMotivation: string;
}

const ConversationImageAnalyzer: React.FC<ConversationImageAnalyzerProps> = ({ selectedCategory }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (PNG, JPG, etc.).",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      toast({
        title: "Image Uploaded Successfully",
        description: "Ready to analyze the conversation.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const analyzeConversation = async () => {
    if (!uploadedImage) {
      toast({
        title: "No Image Uploaded",
        description: "Please upload a conversation screenshot first.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a category first for specialized analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Enhanced mock analysis results based on category
      const mockResults: Record<string, AnalysisResult> = {
        'cars': {
          sentiment: 'neutral',
          keyPoints: [
            'Seller mentions recent maintenance records available',
            'Price seems negotiable based on "open to reasonable offers" language',
            'Seller is motivated due to upcoming move mentioned',
            'No major red flags detected in conversation tone',
            'Seller responds quickly indicating active engagement'
          ],
          suggestedResponse: "Thank you for the detailed information about the recent maintenance - that's exactly what I was hoping to hear from a responsible owner. I really appreciate your transparency about the vehicle's condition. I understand you're moving soon, and I'd love to help make this a smooth transaction for both of us. Based on the current market for similar vehicles and considering the maintenance you've done, would you consider $X? I'm pre-approved for financing and can complete the purchase this week to work with your timeline.",
          negotiationTips: [
            'Emphasize the quick sale benefit due to their move',
            'Acknowledge the maintenance positively to build rapport',
            'Show you\'re a serious, qualified buyer with financing ready',
            'Offer to work with their timeline to add value',
            'Reference market research to justify your offer'
          ],
          priceAnalysis: {
            mentionedPrice: '$15,000',
            priceFlexibility: 'medium'
          },
          urgencyLevel: 'medium',
          sellerMotivation: 'Moving timeline creates moderate urgency'
        },
        'electronics': {
          sentiment: 'positive',
          keyPoints: [
            'Item is in excellent condition with original packaging',
            'Seller mentions barely used, purchased recently',
            'Original accessories and warranty info included',
            'Seller seems flexible on timing for pickup',
            'Multiple interested buyers mentioned (competition factor)'
          ],
          suggestedResponse: "I really appreciate you including all the original packaging and accessories - that shows how well you've cared for it. I understand you have other interested buyers, but I'm ready to purchase today with cash and can pick it up at your convenience. Given that it's still relatively new and you're looking for a quick sale, would you consider $X? I can come get it within the hour if that works for you.",
          negotiationTips: [
            'Act quickly due to competition from other buyers',
            'Emphasize immediate cash payment and pickup',
            'Acknowledge the excellent condition to build rapport',
            'Offer convenience of immediate transaction',
            'Show urgency without appearing desperate'
          ],
          priceAnalysis: {
            mentionedPrice: '$800',
            priceFlexibility: 'high'
          },
          urgencyLevel: 'high',
          sellerMotivation: 'Quick sale desired, multiple buyers create urgency'
        },
        'furniture': {
          sentiment: 'neutral',
          keyPoints: [
            'Seller mentions moving and needs to sell quickly',
            'Furniture is from smoke-free, pet-free home',
            'Some minor wear mentioned but seller is honest about it',
            'Seller seems reasonable and open to negotiation',
            'Pickup logistics discussed - seller is flexible'
          ],
          suggestedResponse: "I really appreciate your honesty about the minor wear - that kind of transparency tells me you're a trustworthy seller. I understand you're moving and need to sell quickly, and I'd love to help make that easier for you. The fact that it's from a smoke-free home is important to me. Given your timeline and the minor wear you mentioned, would $X work? I have a truck and can handle pickup this weekend to work with your moving schedule.",
          negotiationTips: [
            'Leverage the moving timeline for urgency',
            'Offer pickup convenience to add value',
            'Acknowledge honesty about condition to build trust',
            'Emphasize helping their situation',
            'Show you have logistics handled (truck, etc.)'
          ],
          priceAnalysis: {
            mentionedPrice: '$400',
            priceFlexibility: 'high'
          },
          urgencyLevel: 'high',
          sellerMotivation: 'Moving deadline creates high urgency'
        },
        'real-estate': {
          sentiment: 'positive',
          keyPoints: [
            'Seller mentions recent updates and improvements',
            'Property has been well-maintained',
            'Seller seems motivated but not desperate',
            'Flexible on closing timeline mentioned',
            'Open to serious offers from qualified buyers'
          ],
          suggestedResponse: "Thank you for sharing the details about the recent updates - it's clear you've taken excellent care of the property. I'm a pre-qualified buyer with financing already arranged, and I appreciate your flexibility on the closing timeline. Based on recent comparables in the neighborhood and the improvements you've made, I'd like to submit an offer of $X. I can provide proof of funds and am prepared to move quickly if we can reach an agreement.",
          negotiationTips: [
            'Emphasize your pre-qualification and financing',
            'Acknowledge the property improvements positively',
            'Reference comparable sales for justification',
            'Show you\'re a serious, qualified buyer',
            'Offer quick closing if beneficial'
          ],
          priceAnalysis: {
            mentionedPrice: '$285,000',
            priceFlexibility: 'low'
          },
          urgencyLevel: 'low',
          sellerMotivation: 'Motivated but patient, looking for right buyer'
        }
      };

      const result = mockResults[selectedCategory] || mockResults['electronics'];
      setAnalysisResult(result);

      toast({
        title: "Analysis Complete! 🎉",
        description: "Your conversation has been analyzed with AI insights and recommendations.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the conversation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Enhanced Upload Section */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-12 translate-x-12"></div>
        
        <CardHeader className="pb-8 relative z-10">
          <CardTitle className="flex items-center gap-4 text-3xl">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Image className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Image Analyzer
              </div>
              <p className="text-lg text-gray-600 font-normal">Upload conversation screenshots for deep analysis</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 relative z-10">
          <div className="space-y-6">
            <Label className="text-lg font-semibold text-gray-800">Upload Conversation Screenshot</Label>
            
            <div 
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                <div className="space-y-6">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded conversation" 
                    className="max-w-full max-h-64 mx-auto rounded-2xl shadow-xl border-4 border-white"
                  />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-700">Image uploaded successfully!</p>
                    <p className="text-sm text-gray-500">Click to upload a different image</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto">
                    <Upload className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">Drop your screenshot here</p>
                    <p className="text-lg text-gray-600 mb-4">or click to browse files</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileImage className="w-4 h-4" />
                        PNG, JPG
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        Up to 10MB
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {selectedCategory && (
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center gap-3 text-purple-700 font-semibold mb-2">
                <Sparkles className="w-5 h-5" />
                Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')}
              </div>
              <p className="text-purple-600">
                Analysis will be optimized for {selectedCategory.replace('-', ' ')} conversations with specialized insights
              </p>
            </div>
          )}

          <Button 
            onClick={analyzeConversation}
            disabled={isAnalyzing || !uploadedImage}
            className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-4"></div>
                Analyzing Conversation... Please wait
              </>
            ) : (
              <>
                <Eye className="w-6 h-6 mr-4" />
                Analyze Conversation with AI
              </>
            )}
          </Button>

          {/* Features */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">AI Analysis includes:</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Sentiment analysis of conversation tone</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Price flexibility assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Seller motivation analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Personalized response suggestions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Analysis Results */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full -translate-y-16 -translate-x-16"></div>
        
        <CardHeader className="pb-8 relative z-10">
          <CardTitle className="flex items-center gap-4 text-3xl">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AI Analysis Results
              </div>
              <p className="text-lg text-gray-600 font-normal">Insights and recommendations from your conversation</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {!analysisResult ? (
            <div className="text-center py-16 text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Ready to Analyze</h3>
              <p className="text-lg text-gray-500 max-w-sm mx-auto leading-relaxed">
                Upload a conversation screenshot to get AI-powered insights and negotiation advice
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Enhanced Sentiment & Urgency Analysis */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-6 rounded-2xl border-2 ${getSentimentColor(analysisResult.sentiment)}`}>
                  <div className="flex items-center gap-3 font-semibold mb-2">
                    <span className="text-2xl">{getSentimentIcon(analysisResult.sentiment)}</span>
                    <div>
                      <div className="text-lg">Conversation Sentiment</div>
                      <div className="text-sm opacity-80">{analysisResult.sentiment.charAt(0).toUpperCase() + analysisResult.sentiment.slice(1)}</div>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border-2 ${getUrgencyColor(analysisResult.urgencyLevel)}`}>
                  <div className="flex items-center gap-3 font-semibold mb-2">
                    <AlertTriangle className="w-6 h-6" />
                    <div>
                      <div className="text-lg">Urgency Level</div>
                      <div className="text-sm opacity-80">{analysisResult.urgencyLevel.charAt(0).toUpperCase() + analysisResult.urgencyLevel.slice(1)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Motivation */}
              <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center gap-3 text-blue-700 font-semibold mb-3">
                  <TrendingDown className="w-5 h-5" />
                  Seller Motivation Analysis
                </div>
                <p className="text-blue-600 text-lg">{analysisResult.sellerMotivation}</p>
              </div>

              {/* Enhanced Price Analysis */}
              {analysisResult.priceAnalysis && (
                <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                  <div className="flex items-center gap-3 text-green-700 font-semibold mb-4">
                    <TrendingDown className="w-5 h-5" />
                    Price Analysis
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysisResult.priceAnalysis.mentionedPrice && (
                      <div>
                        <div className="text-sm text-green-600 font-medium">Mentioned Price</div>
                        <div className="text-2xl font-bold text-green-800">{analysisResult.priceAnalysis.mentionedPrice}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-green-600 font-medium">Price Flexibility</div>
                      <div className="text-lg font-semibold text-green-700 capitalize">{analysisResult.priceAnalysis.priceFlexibility}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Points */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Key Conversation Points</h4>
                <ul className="space-y-3">
                  {analysisResult.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 p-3 bg-gray-50 rounded-xl">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-base leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enhanced Suggested Response */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900">AI-Generated Response</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(analysisResult.suggestedResponse);
                      toast({
                        title: "Copied!",
                        description: "Response copied to clipboard.",
                      });
                    }}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Copy Response
                  </Button>
                </div>
                <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                  <p className="text-base text-gray-800 leading-relaxed">
                    {analysisResult.suggestedResponse}
                  </p>
                </div>
              </div>

              {/* Enhanced Negotiation Tips */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Strategic Negotiation Tips</h4>
                <div className="grid gap-3">
                  {analysisResult.negotiationTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 text-gray-700 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-base leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationImageAnalyzer;