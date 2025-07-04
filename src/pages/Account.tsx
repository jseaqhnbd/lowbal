import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, CreditCard, Bell, Shield, Crown, Star, Check, X, Edit2, Save, Mail, Phone, MapPin, MessageSquare, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import BackgroundLayout from '../components/shared/BackgroundLayout';
import Logo from '../components/shared/Logo';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    deals: true
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    content: '',
    category: '',
    savings: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const subscriptionTiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['5 negotiations per month', 'Basic AI responses', 'Standard support'],
      current: true,
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'month',
      features: ['Unlimited negotiations', 'Advanced AI responses', 'Voice & image support', 'Priority support'],
      popular: true,
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: 'month',
      features: ['Everything in Pro', 'Market analysis', 'Deal suggestions', 'Custom templates', '24/7 support'],
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleUpgrade = (tier: string) => {
    toast({
      title: "Upgrade Initiated",
      description: `Upgrading to ${tier} plan. Redirecting to payment...`,
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription will remain active until the end of the billing period.",
      variant: "destructive"
    });
  };

  const handleSubmitReview = () => {
    if (!reviewData.title || !reviewData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and review content.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Review Submitted! ⭐",
      description: "Thank you for sharing your experience with Lowbal!",
    });

    // Reset form
    setReviewData({
      rating: 5,
      title: '',
      content: '',
      category: '',
      savings: ''
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <BackgroundLayout>
      {/* Enhanced Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/app" className="text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <Logo size="sm" />
              <h1 className="text-3xl font-black text-white">Account Settings</h1>
            </div>
            <Button
              onClick={handleSignOut}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12 bg-black/20 backdrop-blur-xl shadow-2xl rounded-3xl p-4 h-20 border border-white/20">
            <TabsTrigger 
              value="profile" 
              className="text-lg font-black h-14 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="subscription" 
              className="text-lg font-black h-14 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
            >
              <Crown className="w-5 h-5 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              className="text-lg font-black h-14 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Leave Review
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="text-lg font-black h-14 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
            >
              <Shield className="w-5 h-5 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-black text-gray-900">Profile Information</CardTitle>
                  <Button
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-black px-8 py-4 rounded-2xl text-lg"
                  >
                    {isEditing ? <Save className="w-5 h-5 mr-2" /> : <Edit2 className="w-5 h-5 mr-2" />}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-lg font-black text-gray-800">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                      <Input
                        id="name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        disabled={!isEditing}
                        className="pl-12 h-16 text-lg border-2 bg-white text-gray-900 font-bold rounded-2xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="email" className="text-lg font-black text-gray-800">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        disabled={!isEditing}
                        className="pl-12 h-16 text-lg border-2 bg-white text-gray-900 font-bold rounded-2xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="phone" className="text-lg font-black text-gray-800">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        disabled={!isEditing}
                        className="pl-12 h-16 text-lg border-2 bg-white text-gray-900 font-bold rounded-2xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="location" className="text-lg font-black text-gray-800">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                      <Input
                        id="location"
                        value={userInfo.location}
                        onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                        disabled={!isEditing}
                        className="pl-12 h-16 text-lg border-2 bg-white text-gray-900 font-bold rounded-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">Account Statistics</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-8 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border-2 border-green-200 shadow-lg">
                      <div className="text-4xl font-black text-green-800 mb-2">$3,247</div>
                      <div className="text-lg text-green-600 font-bold">Total Saved</div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-lg">
                      <div className="text-4xl font-black text-blue-800 mb-2">23</div>
                      <div className="text-lg text-blue-600 font-bold">Deals Closed</div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 shadow-lg">
                      <div className="text-4xl font-black text-purple-800 mb-2">78%</div>
                      <div className="text-lg text-purple-600 font-bold">Success Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="space-y-10">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-black text-gray-900">Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 shadow-lg">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">Free Plan</h3>
                      <p className="text-lg text-gray-600 font-bold">5 negotiations remaining this month</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 font-black text-lg px-6 py-3">Current</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-8">
                {subscriptionTiers.map((tier, index) => (
                  <Card key={index} className={`shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl relative transform hover:scale-105 transition-all duration-300 ${tier.popular ? 'ring-4 ring-blue-500' : ''}`}>
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black px-6 py-2 text-lg">
                          <Star className="w-4 h-4 mr-2" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-black text-gray-900">{tier.name}</CardTitle>
                      <div className="text-4xl font-black text-gray-900">
                        {tier.price}
                        <span className="text-lg text-gray-600 font-normal">/{tier.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="text-base font-bold">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleUpgrade(tier.name)}
                        disabled={tier.current}
                        className={`w-full h-16 font-black text-lg rounded-2xl ${
                          tier.current 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : `bg-gradient-to-r ${tier.color} hover:opacity-90 text-white shadow-2xl hover:scale-105 transition-all duration-300`
                        }`}
                      >
                        {tier.current ? 'Current Plan' : `Upgrade to ${tier.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-gray-900">Billing Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                    <div>
                      <h4 className="font-black text-red-800 text-lg">Cancel Subscription</h4>
                      <p className="text-base text-red-600 font-bold">You'll keep access until your billing period ends</p>
                    </div>
                    <Button
                      onClick={handleCancelSubscription}
                      variant="destructive"
                      className="font-black px-8 py-4 rounded-2xl text-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="review">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-black text-gray-900">Share Your Success Story</CardTitle>
                <p className="text-lg text-gray-600 font-bold">Help others by sharing your negotiation experience with Lowbal</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-lg font-black text-gray-800">Your Rating</Label>
                    {renderStars(reviewData.rating, true, (rating) => setReviewData({...reviewData, rating}))}
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="category" className="text-lg font-black text-gray-800">Category (Optional)</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Cars, Electronics, Real Estate"
                      value={reviewData.category}
                      onChange={(e) => setReviewData({...reviewData, category: e.target.value})}
                      className="h-16 text-lg border-2 bg-white text-gray-900 font-bold rounded-2xl"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="title" className="text-lg font-black text-gray-800">Review Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Saved $500 on my car purchase!"
                      value={reviewData.title}
                      onChange={(e) => setReviewData({...reviewData, title: e.target.value})}
                      className="h-16 text-lg border-2 bg-white text-gray-900 font-bold rounded-2xl"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="savings" className="text-lg font-black text-gray-800">Amount Saved (Optional)</Label>
                    <Input
                      id="savings"
                      placeholder="e.g., $500"
                      value={reviewData.savings}
                      onChange={(e) => setReviewData({...reviewData, savings: e.target.value})}
                      className="h-16 text-lg border-2 bg-white text-gray-900 font-bold rounded-2xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="content" className="text-lg font-black text-gray-800">Your Review</Label>
                  <Textarea
                    id="content"
                    placeholder="Tell us about your experience with Lowbal. How did it help you? What category was it? Any tips for other users?"
                    value={reviewData.content}
                    onChange={(e) => setReviewData({...reviewData, content: e.target.value})}
                    className="min-h-[150px] text-lg border-2 bg-white text-gray-900 font-bold rounded-2xl resize-none"
                    rows={6}
                  />
                </div>
                
                <Button 
                  onClick={handleSubmitReview}
                  className="w-full h-16 bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Star className="w-6 h-6 mr-3" />
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-black text-gray-900">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">Email Notifications</h4>
                      <p className="text-base text-gray-600 font-bold">Receive updates about your negotiations</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">Push Notifications</h4>
                      <p className="text-base text-gray-600 font-bold">Get notified about deal responses</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">Deal Suggestions</h4>
                      <p className="text-base text-gray-600 font-bold">Receive better deal recommendations</p>
                    </div>
                    <Switch
                      checked={notifications.deals}
                      onCheckedChange={(checked) => setNotifications({...notifications, deals: checked})}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">Account Actions</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full h-16 font-black text-lg border-2 text-gray-700 rounded-2xl">
                      Export My Data
                    </Button>
                    <Button variant="destructive" className="w-full h-16 font-black text-lg rounded-2xl">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BackgroundLayout>
  );
};

export default Account;