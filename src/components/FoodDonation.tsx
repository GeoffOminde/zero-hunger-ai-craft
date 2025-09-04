import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Clock, Users, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DonationListing {
  id: string;
  foodType: string;
  quantity: string;
  description: string;
  location: string;
  availableUntil: string;
  contactInfo: string;
  status: "available" | "reserved" | "completed";
}

export const FoodDonation = () => {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState<DonationListing[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    description: "",
    location: "",
    availableUntil: "",
    contactInfo: ""
  });

  // Load food listings on component mount
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('food-listings');
      
      if (error) throw error;
      
      // Transform database records to component format
      const transformedListings = data.map((item: any) => ({
        id: item.id,
        foodType: item.food_type,
        quantity: item.quantity,
        description: item.description,
        location: item.location,
        availableUntil: new Date(item.available_until).toLocaleDateString(),
        contactInfo: item.contact_info,
        status: item.status
      }));
      
      setListings(transformedListings);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error("Failed to load food listings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.functions.invoke('food-listings', {
        body: {
          food_type: formData.foodType,
          quantity: formData.quantity,
          description: formData.description,
          location: formData.location,
          available_until: new Date(formData.availableUntil).toISOString(),
          contact_info: formData.contactInfo
        }
      });

      if (error) throw error;

      // Add new listing to local state
      const newListing: DonationListing = {
        id: data.id,
        foodType: data.food_type,
        quantity: data.quantity,
        description: data.description,
        location: data.location,
        availableUntil: new Date(data.available_until).toLocaleDateString(),
        contactInfo: data.contact_info,
        status: data.status
      };
      
      setListings(prev => [newListing, ...prev]);
      setFormData({
        foodType: "",
        quantity: "",
        description: "",
        location: "",
        availableUntil: "",
        contactInfo: ""
      });
      setShowForm(false);
      toast.success("Food listing created successfully!");
      
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error("Failed to create food listing");
    }
  };

  const handleReserve = async (id: string) => {
    try {
      const { error } = await supabase.functions.invoke('food-listings', {
        body: { status: 'reserved' },
        headers: { 'Content-Type': 'application/json' }
      });

      if (error) throw error;

      setListings(prev => 
        prev.map(listing => 
          listing.id === id 
            ? { ...listing, status: "reserved" }
            : listing
        )
      );
      toast.success("Food reserved! We'll connect you with the donor.");
      
    } catch (error) {
      console.error('Error reserving listing:', error);
      toast.error("Failed to reserve food listing");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success/10 text-success">Available</Badge>;
      case "reserved":
        return <Badge className="bg-warning/10 text-warning">Reserved</Badge>;
      case "completed":
        return <Badge className="bg-muted/10 text-muted-foreground">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <section id="donate" className="py-20 px-4 bg-gradient-earth">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart size={16} />
            Food Donation Platform
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Share Food, Share Hope
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect surplus food with communities in need. Every meal counts toward achieving Zero Hunger.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Action Panel */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="text-primary" size={24} />
                  Donate Food
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showForm ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Have surplus food to share? Create a listing and help feed your community.
                    </p>
                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => setShowForm(true)}
                    >
                      <Plus size={20} />
                      Create Donation Listing
                    </Button>
                    
                    <div className="pt-6 border-t space-y-3">
                      <h4 className="font-semibold text-foreground">Quick Stats</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Listings</span>
                          <span className="text-sm font-medium">{loading ? '...' : listings.filter(l => l.status === "available").length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Listings</span>
                          <span className="text-sm font-medium">{loading ? '...' : listings.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Reserved Today</span>
                          <span className="text-sm font-medium">{loading ? '...' : listings.filter(l => l.status === "reserved").length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="foodType">Food Type</Label>
                      <Input
                        id="foodType"
                        value={formData.foodType}
                        onChange={(e) => setFormData(prev => ({...prev, foodType: e.target.value}))}
                        placeholder="e.g., Fresh vegetables, Bread"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({...prev, quantity: e.target.value}))}
                        placeholder="e.g., 10 lbs, 20 servings"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                        placeholder="Describe the food condition, type, etc."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                        placeholder="e.g., 123 Main St, City"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="availableUntil">Available Until</Label>
                      <Input
                        id="availableUntil"
                        value={formData.availableUntil}
                        onChange={(e) => setFormData(prev => ({...prev, availableUntil: e.target.value}))}
                        placeholder="e.g., Today 6:00 PM"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactInfo">Contact Information</Label>
                      <Input
                        id="contactInfo"
                        type="email"
                        value={formData.contactInfo}
                        onChange={(e) => setFormData(prev => ({...prev, contactInfo: e.target.value}))}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" variant="success" className="flex-1">
                        <Check size={20} />
                        Create Listing
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Listings Grid */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-foreground">Available Food Donations</h3>
                <Badge variant="outline" className="px-3 py-1">
                  {listings.filter(l => l.status === "available").length} Available
                </Badge>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
                    <p className="text-muted-foreground">Loading food donations...</p>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="mx-auto text-muted-foreground mb-4" size={48} />
                    <p className="text-muted-foreground">No food donations available yet.</p>
                    <p className="text-sm text-muted-foreground">Be the first to create a listing!</p>
                  </div>
                ) : (
                  listings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-card transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-1">
                              {listing.foodType}
                            </h4>
                            <p className="text-muted-foreground text-sm mb-2">
                              Quantity: {listing.quantity}
                            </p>
                            {getStatusBadge(listing.status)}
                          </div>
                          {listing.status === "available" && (
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => handleReserve(listing.id)}
                            >
                              <Heart size={16} />
                              Reserve
                            </Button>
                          )}
                        </div>

                        <p className="text-foreground mb-4">{listing.description}</p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} />
                            {listing.location}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock size={16} />
                            Available until: {listing.availableUntil}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users size={16} />
                            Contact: {listing.contactInfo}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};