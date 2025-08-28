import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Heart, MapPin, Clock, Users, Plus, Check, Search, Filter, Star, Truck, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface DonationListing {
  id: string;
  foodType: string;
  quantity: string;
  description: string;
  location: string;
  availableUntil: string;
  contactInfo: string;
  status: "available" | "reserved" | "completed";
  category: string;
  urgency: "low" | "medium" | "high";
  rating: number;
  distance: number;
  images?: string[];
  estimatedMeals: number;
}

export const EnhancedFoodDonation = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDistance, setFilterDistance] = useState([50]);
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("browse");
  
  const [listings, setListings] = useState<DonationListing[]>([
    {
      id: "1",
      foodType: "Organic Fresh Vegetables",
      quantity: "25 lbs",
      description: "Premium organic vegetables from our local farm. Include carrots, lettuce, tomatoes, and bell peppers. Perfect condition, harvested this morning.",
      location: "Green Valley Farm, 123 Farm Road",
      availableUntil: "Today 6:00 PM",
      contactInfo: "farm@greenvalley.com",
      status: "available",
      category: "vegetables",
      urgency: "high",
      rating: 4.9,
      distance: 2.3,
      estimatedMeals: 40
    },
    {
      id: "2",
      foodType: "Artisan Bakery Selection",
      quantity: "30 items",
      description: "Fresh breads, pastries, and sandwiches from our artisan bakery. All items baked this morning using organic ingredients.",
      location: "Heritage Bakery, 456 Main Street",
      availableUntil: "Today 8:00 PM",
      contactInfo: "contact@heritagebakery.com",
      status: "available",
      category: "bakery",
      urgency: "medium",
      rating: 4.7,
      distance: 1.8,
      estimatedMeals: 30
    },
    {
      id: "3",
      foodType: "Restaurant Prepared Meals",
      quantity: "50 portions",
      description: "Freshly prepared nutritious meals including vegetarian and meat options. Perfect for immediate distribution to families in need.",
      location: "Community Kitchen, 789 Central Ave",
      availableUntil: "Today 7:00 PM",
      contactInfo: "info@communitykitchen.org",
      status: "available",
      category: "prepared",
      urgency: "high",
      rating: 4.8,
      distance: 3.1,
      estimatedMeals: 50
    }
  ]);
  
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    description: "",
    location: "",
    availableUntil: "",
    contactInfo: "",
    category: "",
    urgency: "medium"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newListing: DonationListing = {
      id: Date.now().toString(),
      ...formData,
      status: "available",
      rating: 0,
      distance: Math.random() * 10,
      estimatedMeals: Math.floor(Math.random() * 100) + 10,
      urgency: formData.urgency as "low" | "medium" | "high"
    };
    
    setListings(prev => [newListing, ...prev]);
    setFormData({
      foodType: "",
      quantity: "",
      description: "",
      location: "",
      availableUntil: "",
      contactInfo: "",
      category: "",
      urgency: "medium"
    });
    setShowForm(false);
    toast.success("Food listing created successfully!", {
      description: "Your donation is now visible to recipients in your area."
    });
  };

  const handleReserve = (id: string) => {
    setListings(prev => 
      prev.map(listing => 
        listing.id === id 
          ? { ...listing, status: "reserved" }
          : listing
      )
    );
    toast.success("Food reserved successfully!", {
      description: "The donor will be notified and contact details shared."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success/10 text-success border-success/20">Available</Badge>;
      case "reserved":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Reserved</Badge>;
      case "completed":
        return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      case "low":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.foodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || listing.category === filterCategory;
    const matchesDistance = listing.distance <= filterDistance[0];
    const matchesUrgency = filterUrgency === "all" || listing.urgency === filterUrgency;
    
    return matchesSearch && matchesCategory && matchesDistance && matchesUrgency;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return a.distance - b.distance;
      case "rating":
        return b.rating - a.rating;
      case "urgency":
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      default:
        return parseInt(b.id) - parseInt(a.id);
    }
  });

  return (
    <section id="donate" className="py-24 px-4 bg-gradient-earth">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-success text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-glow"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Heart size={18} />
            Smart Food Donation Network
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Share Food, <span className="bg-gradient-to-r from-success via-primary to-accent bg-clip-text text-transparent">Share Hope</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Advanced AI-powered matching system connects surplus food with communities in need. 
            Every meal counts toward achieving Zero Hunger in our cities.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <Search size={16} />
                <span className="hidden sm:inline">Browse</span>
              </TabsTrigger>
              <TabsTrigger value="donate" className="flex items-center gap-2">
                <Plus size={16} />
                <span className="hidden sm:inline">Donate</span>
              </TabsTrigger>
              <TabsTrigger value="my-donations" className="flex items-center gap-2">
                <Users size={16} />
                <span className="hidden sm:inline">My Items</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="browse" className="space-y-8">
            {/* Enhanced Filters */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-xl border-0 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search Food</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          id="search"
                          placeholder="Search by food type..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                          <Filter size={16} className="mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="fruits">Fruits</SelectItem>
                          <SelectItem value="bakery">Bakery</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                          <SelectItem value="prepared">Prepared Meals</SelectItem>
                          <SelectItem value="canned">Canned Goods</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance: {filterDistance[0]} miles</Label>
                      <Slider
                        id="distance"
                        min={1}
                        max={50}
                        step={1}
                        value={filterDistance}
                        onValueChange={setFilterDistance}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sort">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="distance">Closest First</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="urgency">Most Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Listings */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-heading font-semibold text-foreground">
                  Available Food Donations
                </h3>
                <Badge variant="outline" className="px-4 py-2 text-lg">
                  {sortedListings.filter(l => l.status === "available").length} Available
                </Badge>
              </div>

              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {sortedListings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="shadow-xl hover:shadow-floating transition-all duration-500 border-0 bg-gradient-glass backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <h4 className="text-xl font-heading font-bold text-foreground">
                                    {listing.foodType}
                                  </h4>
                                  <Badge 
                                    variant="outline" 
                                    className={`${getUrgencyColor(listing.urgency)} border-current`}
                                  >
                                    {listing.urgency} priority
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="font-medium">Quantity: {listing.quantity}</span>
                                  <span className="flex items-center gap-1">
                                    <Users size={14} />
                                    ~{listing.estimatedMeals} meals
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Star className="text-warning fill-current" size={14} />
                                    <span>{listing.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                                {getStatusBadge(listing.status)}
                              </div>
                              <div className="text-right space-y-2">
                                {listing.status === "available" && (
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="success" 
                                      size="sm"
                                      onClick={() => handleReserve(listing.id)}
                                      className="group"
                                    >
                                      <Heart size={16} className="group-hover:scale-110 transition-transform" />
                                      Reserve
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <MessageCircle size={16} />
                                      Message
                                    </Button>
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {listing.distance} miles away
                                </p>
                              </div>
                            </div>

                            <motion.p 
                              className="text-foreground mb-6 leading-relaxed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {listing.description}
                            </motion.p>

                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin size={16} className="text-primary flex-shrink-0" />
                                <span>{listing.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock size={16} className="text-warning flex-shrink-0" />
                                <span>Available until: {listing.availableUntil}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone size={16} className="text-success flex-shrink-0" />
                                <span>{listing.contactInfo}</span>
                              </div>
                            </div>

                            {listing.status === "available" && (
                              <div className="mt-6 pt-6 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Truck size={16} />
                                    <span>Free pickup available</span>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Get Directions
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {sortedListings.length === 0 && (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Search className="mx-auto text-muted-foreground mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No donations found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="donate" className="space-y-8">
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-xl border-0 bg-gradient-glass backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <Plus className="mx-auto text-primary mb-4" size={48} />
                  </motion.div>
                  <CardTitle className="text-3xl font-heading font-bold">Create Food Donation</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Share your surplus food with communities in need
                  </p>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="foodType">Food Type *</Label>
                        <Input
                          id="foodType"
                          value={formData.foodType}
                          onChange={(e) => setFormData(prev => ({...prev, foodType: e.target.value}))}
                          placeholder="e.g., Fresh vegetables, Bread, Prepared meals"
                          required
                          className="transition-all duration-300 focus:shadow-glow"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          value={formData.quantity}
                          onChange={(e) => setFormData(prev => ({...prev, quantity: e.target.value}))}
                          placeholder="e.g., 10 lbs, 20 servings, 5 boxes"
                          required
                          className="transition-all duration-300 focus:shadow-glow"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                        required
                      >
                        <SelectTrigger className="transition-all duration-300 focus:shadow-glow">
                          <SelectValue placeholder="Select food category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="fruits">Fruits</SelectItem>
                          <SelectItem value="bakery">Bakery Items</SelectItem>
                          <SelectItem value="dairy">Dairy Products</SelectItem>
                          <SelectItem value="prepared">Prepared Meals</SelectItem>
                          <SelectItem value="canned">Canned Goods</SelectItem>
                          <SelectItem value="frozen">Frozen Items</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                        placeholder="Describe the food condition, ingredients, preparation method, and any special notes"
                        rows={4}
                        required
                        className="transition-all duration-300 focus:shadow-glow resize-none"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location">Pickup Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                          placeholder="e.g., 123 Main St, City, State"
                          required
                          className="transition-all duration-300 focus:shadow-glow"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availableUntil">Available Until *</Label>
                        <Input
                          id="availableUntil"
                          value={formData.availableUntil}
                          onChange={(e) => setFormData(prev => ({...prev, availableUntil: e.target.value}))}
                          placeholder="e.g., Today 6:00 PM, Tomorrow 2:00 PM"
                          required
                          className="transition-all duration-300 focus:shadow-glow"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactInfo">Contact Information *</Label>
                        <Input
                          id="contactInfo"
                          type="email"
                          value={formData.contactInfo}
                          onChange={(e) => setFormData(prev => ({...prev, contactInfo: e.target.value}))}
                          placeholder="your@email.com"
                          required
                          className="transition-all duration-300 focus:shadow-glow"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="urgency">Priority Level</Label>
                        <Select 
                          value={formData.urgency} 
                          onValueChange={(value) => setFormData(prev => ({...prev, urgency: value}))}
                        >
                          <SelectTrigger className="transition-all duration-300 focus:shadow-glow">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - Can wait</SelectItem>
                            <SelectItem value="medium">Medium - Today preferred</SelectItem>
                            <SelectItem value="high">High - Urgent pickup needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <motion.div
                      className="pt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button 
                        type="submit" 
                        variant="success" 
                        className="w-full group text-lg py-6"
                        size="lg"
                      >
                        <Check size={20} className="group-hover:rotate-12 transition-transform" />
                        Create Donation Listing
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="my-donations">
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Users className="mx-auto text-muted-foreground mb-4" size={64} />
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">My Donations</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Track your donation history and manage active listings. Connect with Supabase to enable user accounts.
              </p>
              <Button variant="outline" size="lg">
                Connect Supabase for User Features
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};