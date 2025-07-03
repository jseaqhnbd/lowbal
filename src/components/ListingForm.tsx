import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Sparkles, AlertCircle } from "lucide-react";

interface ListingFormProps {
  listingTitle: string;
  setListingTitle: (value: string) => void;
  listingPrice: string;
  setListingPrice: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  extraNotes: string;
  setExtraNotes: (value: string) => void;
  isLoading: boolean;
  onGenerateOffer: () => void;
  selectedCategory: string;
}

const ListingForm: React.FC<ListingFormProps> = ({
  listingTitle,
  setListingTitle,
  listingPrice,
  setListingPrice,
  platform,
  setPlatform,
  extraNotes,
  setExtraNotes,
  isLoading,
  onGenerateOffer,
  selectedCategory
}) => {
  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          Listing Details
        </CardTitle>
        <p className="text-gray-600">Enter the details of the item you want to negotiate for</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {!selectedCategory && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Please select a category first for optimized results</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="title" className="text-base font-medium">Listing Title or Description</Label>
          <Input
            id="title"
            placeholder={selectedCategory === 'cars' ? "e.g., 2018 Honda Civic LX, 45k miles" : 
                        selectedCategory === 'real-estate' ? "e.g., 3BR/2BA Ranch Home, Downtown" :
                        selectedCategory === 'electronics' ? "e.g., MacBook Pro 13-inch M2, Like New" :
                        "e.g., iPhone 14 Pro, 2018 Honda Civic, Vintage Couch"}
            value={listingTitle}
            onChange={(e) => setListingTitle(e.target.value)}
            className="h-12 text-base border-2 focus:border-green-500 transition-colors"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="price" className="text-base font-medium">Listing Price ($)</Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter the asking price"
            value={listingPrice}
            onChange={(e) => setListingPrice(e.target.value)}
            className="h-12 text-base border-2 focus:border-green-500 transition-colors"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="platform" className="text-base font-medium">Platform</Label>
          <Select onValueChange={setPlatform}>
            <SelectTrigger className="h-12 text-base border-2 focus:border-green-500 transition-colors">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Facebook">Facebook Marketplace</SelectItem>
              <SelectItem value="Craigslist">Craigslist</SelectItem>
              <SelectItem value="Zillow">Zillow</SelectItem>
              <SelectItem value="eBay">eBay</SelectItem>
              <SelectItem value="OfferUp">OfferUp</SelectItem>
              <SelectItem value="AutoTrader">AutoTrader</SelectItem>
              <SelectItem value="Cars.com">Cars.com</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-medium">Extra Notes / Seller Info (Optional)</Label>
          <Textarea
            id="notes"
            placeholder={selectedCategory === 'cars' ? "e.g., One owner, recent maintenance, clean title..." :
                        selectedCategory === 'real-estate' ? "e.g., Motivated seller, needs quick closing..." :
                        selectedCategory === 'electronics' ? "e.g., Original packaging, barely used..." :
                        "Any additional context about the item or seller..."}
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            className="min-h-[100px] text-base border-2 focus:border-green-500 transition-colors resize-none"
            rows={4}
          />
        </div>

        {selectedCategory && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
              <Sparkles className="w-4 h-4" />
              Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')}
            </div>
            <p className="text-sm text-green-600">
              Negotiation strategy will be optimized for {selectedCategory.replace('-', ' ')} deals
            </p>
          </div>
        )}

        <Button 
          onClick={onGenerateOffer}
          disabled={isLoading || !selectedCategory}
          className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
              Generating Your Strategy...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Generate Offer & Message
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ListingForm;