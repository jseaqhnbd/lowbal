import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Sparkles, Eye, MessageSquare, TrendingDown, Camera, FileImage, CheckCircle, AlertTriangle, Send, Bot, User, Copy, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConversationImageAnalyzerProps {
  selectedCategory: string;
}

interface GoogleVisionResponse {
  responses: Array<{
    fullTextAnnotation?: {
      text: string;
    };
    error?: {
      message: string;
    };
  }>;
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
  extractedText?: string;
}

const ConversationImageAnalyzer: React.FC<ConversationImageAnalyzerProps> = ({ selectedCategory }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isAudio?: boolean;
  }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Google Vision API configuration
  const GOOGLE_VISION_API_KEY = "AIzaSyCbVeYYvr-chHdObJeJuQb1YjY8Baldv0Q";
  const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const extractTextFromImage = async (imageFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64Image = (reader.result as string).split(",")[1]; // Remove data prefix
          
          const response = await fetch(GOOGLE_VISION_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requests: [
                {
                  image: { content: base64Image },
                  features: [{ type: "TEXT_DETECTION" }],
                },
              ],
            }),
          });

          const data: GoogleVisionResponse = await response.json();
          
          if (data.responses?.[0]?.error) {
            throw new Error(data.responses[0].error.message);
          }
          
          const extractedText = data.responses?.[0]?.fullTextAnnotation?.text || "No text found in the image.";
          resolve(extractedText);
          
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(imageFile);
    });
  };

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
    
    // Store the file for text extraction during analysis
    (window as any).uploadedImageFile = file;
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
      // Step 1: Extract text from image using Google Vision API
      const imageFile = (window as any).uploadedImageFile;
      let extractedText = '';
      
      if (imageFile) {
        toast({
          title: "Extracting Text...",
          description: "Reading conversation text from your image.",
        });
        
        try {
          extractedText = await extractTextFromImage(imageFile);
          setExtractedText(extractedText);
        } catch (error) {
          console.error('Text extraction failed:', error);
          toast({
            title: "Text Extraction Failed",
            description: "Proceeding with visual analysis only.",
            variant: "destructive"
          });
        }
      }

      // Step 2: Analyze the extracted text
      toast({
        title: "Analyzing Conversation...",
        description: "AI is processing the conversation content.",
      });
      
      // Simulate AI analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Enhanced analysis results based on category and extracted text
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
          sellerMotivation: 'Moving timeline creates moderate urgency',
          extractedText: extractedText
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
          sellerMotivation: 'Quick sale desired, multiple buyers create urgency',
          extractedText: extractedText
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
          sellerMotivation: 'Moving deadline creates high urgency',
          extractedText: extractedText
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
          sellerMotivation: 'Motivated but patient, looking for right buyer',
          extractedText: extractedText
        }
      };

      const result = mockResults[selectedCategory] || mockResults['electronics'];
      setAnalysisResult(result);

      // Add initial AI message to chat
      const initialMessage = {
        id: Date.now().toString(),
        type: 'ai' as const,
        content: `I've analyzed your conversation screenshot and extracted the text content. Based on the ${selectedCategory} negotiation, I can see that ${result.sellerMotivation.toLowerCase()}. The seller's sentiment appears ${result.sentiment}. ${extractedText ? 'I found conversation text that I can help you respond to.' : ''} Feel free to ask me any questions about the analysis or negotiation strategy!`,
        timestamp: new Date()
      };
      setChatMessages([initialMessage]);

      toast({
        title: "Analysis Complete! 🎉",
        description: `Your conversation has been analyzed${extractedText ? ' and text extracted' : ''}. You can now chat with AI about the results.`,
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputMessage,
      timestamp: new Date(),
      isAudio: isRecording
    };

    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);

    setIsLoading(true);
    setInputMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aiResponse = generateContextualResponse(inputMessage, analysisResult);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };

      setChatMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateContextualResponse = (userInput: string, analysis: AnalysisResult | null) => {
    if (!analysis) return "Please upload and analyze a conversation first so I can provide specific guidance.";

    // If we have extracted text, provide more specific responses
    if (analysis.extractedText && userInput.toLowerCase().includes('text')) {
      return `Here's the text I extracted from your conversation: "${analysis.extractedText.substring(0, 200)}${analysis.extractedText.length > 200 ? '...' : ''}" Based on this content, I can help you craft the perfect response. What specific aspect would you like help with?`;
    }

    const responses = [
      `Based on the analysis, I'd recommend focusing on the seller's ${analysis.urgencyLevel} urgency level. ${analysis.sellerMotivation} This gives you leverage in the negotiation.`,
      `The conversation shows ${analysis.sentiment} sentiment, which means you should ${analysis.sentiment === 'positive' ? 'maintain the friendly tone' : analysis.sentiment === 'negative' ? 'address any concerns first' : 'build more rapport before making your offer'}.`,
      `Given the ${analysis.priceAnalysis?.priceFlexibility || 'medium'} price flexibility I detected, you have ${analysis.priceAnalysis?.priceFlexibility === 'high' ? 'good room to negotiate' : analysis.priceAnalysis?.priceFlexibility === 'low' ? 'limited negotiation space' : 'moderate negotiation potential'}.`,
      `Here's a key insight from the analysis: ${analysis.keyPoints[Math.floor(Math.random() * analysis.keyPoints.length)]}. You can use this to your advantage.`,
      `My recommendation is to ${analysis.negotiationTips[Math.floor(Math.random() * analysis.negotiationTips.length)].toLowerCase()}.`,
      analysis.extractedText ? `Based on the conversation text I extracted, I can see specific details that will help craft your response. Would you like me to suggest a specific reply?` : ''
    ];

    const filteredResponses = responses.filter(r => r.length > 0);
    return filteredResponses[Math.floor(Math.random() * filteredResponses.length)];
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setTimeout(() => {
        setInputMessage("What's the best strategy based on this analysis?");
        toast({
          title: "Voice Recorded",
          description: "Your voice message has been converted to text.",
        });
      }, 1000);
    } else {
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak your message now...",
      });
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
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Enhanced Upload Section */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Image className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Image Analyzer
              </div>
              <p className="text-xs text-gray-600 font-normal">Upload conversation screenshots for deep analysis</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-800">Upload Conversation Screenshot</Label>
            
            <div 
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all duration-300 cursor-pointer ${
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
                <div className="space-y-3">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded conversation" 
                    className="max-w-full max-h-32 mx-auto rounded-xl shadow-lg border-2 border-white"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Image uploaded successfully!</p>
                    <p className="text-xs text-gray-500">Click to upload a different image</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-700 mb-1">Drop your screenshot here</p>
                    <p className="text-sm text-gray-600 mb-2">or click to browse files</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileImage className="w-3 h-3" />
                        PNG, JPG
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
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
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')}
              </div>
              <p className="text-purple-600 text-xs">
                Analysis will be optimized for {selectedCategory.replace('-', ' ')} conversations
              </p>
            </div>
          )}

          {extractedText && (
            <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                <CheckCircle className="w-3 h-3" />
                Text Extracted Successfully
              </div>
              <div className="text-green-600 text-xs max-h-20 overflow-y-auto">
                {extractedText.substring(0, 200)}
                {extractedText.length > 200 && '...'}
              </div>
            </div>
          )}
          <Button 
            onClick={analyzeConversation}
            disabled={isAnalyzing || !uploadedImage}
            className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                {extractedText ? 'Analyzing Text...' : 'Extracting & Analyzing...'}
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Analysis Results with Dynamic Chat */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-base font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AI Analysis Chat
              </div>
              <p className="text-xs text-gray-600 font-normal">Chat with AI about your analysis results</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col h-[400px]">
          {!analysisResult ? (
            <div className="flex-1 flex items-center justify-center text-center py-8 text-gray-500">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-1">Ready to Analyze</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Upload a conversation screenshot to extract text and get AI-powered insights about negotiation strategy
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Quick Analysis Summary */}
              <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className={`p-2 rounded-lg border text-xs ${getSentimentColor(analysisResult.sentiment)}`}>
                    <div className="flex items-center gap-1 font-semibold">
                      <span className="text-sm">{getSentimentIcon(analysisResult.sentiment)}</span>
                      <div>
                        <div>Sentiment</div>
                        <div className="text-xs opacity-80">{analysisResult.sentiment}</div>
                      </div>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg border text-xs ${getUrgencyColor(analysisResult.urgencyLevel)}`}>
                    <div className="flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      <div>
                        <div>Urgency</div>
                        <div className="text-xs opacity-80">{analysisResult.urgencyLevel}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-blue-700 font-medium">{analysisResult.sellerMotivation}</p>
                {analysisResult.extractedText && (
                  <div className="mt-2 p-2 bg-white/50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">✓ Text extracted and analyzed</p>
                  </div>
                )}
              </div>

              {/* Chat Messages with Dynamic Scrolling */}
              <div className="flex-1 overflow-y-auto mb-3 space-y-2 max-h-[250px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollBehavior: 'smooth' }}>
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.type === 'ai' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}>
                      {message.type === 'ai' ? (
                        <Bot className="w-3 h-3 text-white" />
                      ) : (
                        <User className="w-3 h-3 text-white" />
                      )}
                    </div>
                    
                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-2 rounded-xl max-w-[85%] ${
                        message.type === 'ai'
                          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-blue-900'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-gray-900'
                      }`}>
                        <p className="text-xs leading-relaxed">{message.content}</p>
                        {message.isAudio && (
                          <div className="mt-1 text-xs text-gray-500 italic">🎤 Voice message</div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'ai' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                              toast({ title: "Copied!", description: "Message copied to clipboard." });
                            }}
                            className="h-4 px-1 text-xs"
                          >
                            <Copy className="w-2 h-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-2">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                        <span className="text-xs text-blue-700 ml-1">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Ask me about the analysis, extracted text, negotiation strategy, or get specific advice..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="min-h-[50px] border-2 focus:border-blue-500 transition-colors resize-none text-xs"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceRecording}
                    className={`flex-shrink-0 h-6 px-2 text-xs ${isRecording ? 'bg-red-100 border-red-300 text-red-700' : ''}`}
                  >
                    {isRecording ? <MicOff className="w-2 h-2 mr-1" /> : <Mic className="w-2 h-2 mr-1" />}
                    {isRecording ? 'Stop' : 'Voice'}
                  </Button>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold h-6 text-xs"
                  >
                    {isLoading ? (
                      <div className="w-2 h-2 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                    ) : (
                      <Send className="w-2 h-2 mr-1" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationImageAnalyzer;