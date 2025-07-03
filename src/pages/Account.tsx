import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, CreditCard, Bell, Shield, Crown, Star, Check, X, Edit2, Save, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
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
  const { toast } = useToast();

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
      features: ['Unlimited negotiations', 'Advanced AI responses', 'URL parser', 'Image analyzer', 'Priority support'],
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

  return (
    <BackgroundLayout>
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/app" className="text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <Logo size="sm" />
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/20 backdrop-blur-xl shadow-2xl rounded-2xl p-2 h-16 border border-white/20">
            <TabsTrigger 
              value="profile" 
              className="text-base font-bold h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="subscription" 
              className="text-base font-bold h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
            >
              <Crown className="w-5 h-5 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="text-base font-bold h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300 text-gray-300 hover:text-white"
            >
              <Shield className="w-5 h-5 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">Profile Information</CardTitle>
                  <Button
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold"
                  >
                    {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold text-gray-800">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 h-12 text-base border-2 bg-white text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold text-gray-800">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 h-12 text-base border-2 bg-white text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-semibold text-gray-800">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 h-12 text-base border-2 bg-white text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base font-semibold text-gray-800">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="location"
                        value={userInfo.location}
                        onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 h-12 text-base border-2 bg-white text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-800">$3,247</div>
                      <div className="text-sm text-green-600 font-medium">Total Saved</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">23</div>
                      <div className="text-sm text-blue-600 font-medium">Deals Closed</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="text-2xl font-bold text-purple-800">78%</div>
                      <div className="text-sm text-purple-600 font-medium">Success Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="space-y-8">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Free Plan</h3>
                      <p className="text-gray-600">5 negotiations remaining this month</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 font-bold">Current</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {subscriptionTiers.map((tier, index) => (
                  <Card key={index} className={`shadow-2xl border-0 bg-white/95 backdrop-blur-xl relative ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-4 py-1">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl font-bold text-gray-900">{tier.name}</CardTitle>
                      <div className="text-3xl font-black text-gray-900">
                        {tier.price}
                        <span className="text-sm text-gray-600 font-normal">/{tier.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-700">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleUpgrade(tier.name)}
                        disabled={tier.current}
                        className={`w-full h-12 font-bold ${
                          tier.current 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : `bg-gradient-to-r ${tier.color} hover:opacity-90 text-white`
                        }`}
                      >
                        {tier.current ? 'Current Plan' : `Upgrade to ${tier.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Billing Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                    <div>
                      <h4 className="font-bold text-red-800">Cancel Subscription</h4>
                      <p className="text-sm text-red-600">You'll keep access until your billing period ends</p>
                    </div>
                    <Button
                      onClick={handleCancelSubscription}
                      variant="destructive"
                      className="font-bold"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about your negotiations</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified about deal responses</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-900">Deal Suggestions</h4>
                      <p className="text-sm text-gray-600">Receive better deal recommendations</p>
                    </div>
                    <Switch
                      checked={notifications.deals}
                      onCheckedChange={(checked) => setNotifications({...notifications, deals: checked})}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full h-12 font-bold border-2 text-gray-700">
                      Export My Data
                    </Button>
                    <Button variant="destructive" className="w-full h-12 font-bold">
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