import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, Zap, Clock, CheckCircle, AlertTriangle, Search, Filter, BarChart3, Brain, Sparkles, Leaf } from "lucide-react";
import { toast } from "sonner";

interface FoodAnalysis {
  name: string;
  category: string;
  freshness: "excellent" | "good" | "fair" | "poor";
  estimatedExpiry: string;
  nutritionalValue: string;
  donationSuitability: "excellent" | "good" | "not_recommended";
  confidence: number;
  aiInsights: string[];
  carbonFootprint: string;
  recommendedActions: string[];
}

interface AnalysisHistory {
  id: string;
  timestamp: Date;
  analysis: FoodAnalysis;
  image: string;
}

export const EnhancedAIScanner = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("scanner");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Enhanced AI analysis with more detailed results
  const analyzeFood = async (imageFile: File) => {
    setIsAnalyzing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(imageFile);

      // Simulate advanced AI processing
      await new Promise(resolve => setTimeout(resolve, 4000));

      const mockResults: FoodAnalysis[] = [
        {
          name: "Organic Apples (Gala Variety)",
          category: "Fruit",
          freshness: "excellent",
          estimatedExpiry: "5-7 days",
          nutritionalValue: "High vitamin C (14% DV), fiber (4g), potassium (195mg)",
          donationSuitability: "excellent",
          confidence: 97,
          aiInsights: [
            "High sugar content makes them perfect for energy",
            "Natural antioxidants support immune system",
            "Ideal for children and elderly nutrition programs"
          ],
          carbonFootprint: "0.3kg CO2 per lb",
          recommendedActions: [
            "Best donated to food banks within 3 days",
            "Store in cool, dry place",
            "Can be used for juice or cooking if softening"
          ]
        },
        {
          name: "Mixed Leafy Greens",
          category: "Vegetables", 
          freshness: "good",
          estimatedExpiry: "2-3 days",
          nutritionalValue: "Rich in iron (2.7mg), vitamin K (145mcg), folate (194mcg)",
          donationSuitability: "excellent",
          confidence: 94,
          aiInsights: [
            "Peak nutritional value for next 48 hours",
            "Excellent source of essential minerals",
            "Perfect for salad preparation or cooking"
          ],
          carbonFootprint: "0.1kg CO2 per lb",
          recommendedActions: [
            "Prioritize immediate donation",
            "Keep refrigerated at all times",
            "Best for fresh consumption programs"
          ]
        },
        {
          name: "Artisan Sourdough Bread",
          category: "Bakery",
          freshness: "good",
          estimatedExpiry: "1-2 days",
          nutritionalValue: "Complex carbohydrates (24g), protein (5g), low GI",
          donationSuitability: "good",
          confidence: 91,
          aiInsights: [
            "Sourdough has longer shelf life than regular bread",
            "Probiotic benefits from natural fermentation",
            "Can be frozen for extended donation period"
          ],
          carbonFootprint: "0.9kg CO2 per loaf",
          recommendedActions: [
            "Consider freezing for later donation",
            "Perfect for soup kitchens and shelters",
            "Can be used for bread pudding if staling"
          ]
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysis(randomResult);
      
      // Add to history
      const newHistoryItem: AnalysisHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        analysis: randomResult,
        image: imagePreview || ""
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      
      toast.success("Advanced AI analysis completed!", {
        description: `Detected ${randomResult.name} with ${randomResult.confidence}% confidence`
      });
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        analyzeFood(file);
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      toast.error("Camera access denied");
    }
  };

  const capturePhoto = useCallback(() => {
    if (cameraRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = cameraRef.current.videoWidth;
      canvas.height = cameraRef.current.videoHeight;
      context?.drawImage(cameraRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          analyzeFood(file);
          setShowCamera(false);
          // Stop camera stream
          const stream = cameraRef.current?.srcObject as MediaStream;
          stream?.getTracks().forEach(track => track.stop());
        }
      });
    }
  }, []);

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case "excellent": return "text-success bg-success/10 border-success/20";
      case "good": return "text-primary bg-primary/10 border-primary/20";
      case "fair": return "text-warning bg-warning/10 border-warning/20";
      case "poor": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case "excellent": return <CheckCircle className="text-success" size={20} />;
      case "good": return <CheckCircle className="text-primary" size={20} />;
      case "not_recommended": return <AlertTriangle className="text-destructive" size={20} />;
      default: return <Clock className="text-muted-foreground" size={20} />;
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.analysis.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.analysis.category.toLowerCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="scanner" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-glow"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Brain size={18} />
            Advanced AI Food Intelligence
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Smart Food <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">Scanner</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Revolutionary AI technology that analyzes food quality, nutritional content, and donation potential
            with scientific precision and environmental consciousness.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <Zap size={16} />
                <span className="hidden sm:inline">Scanner</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Sparkles size={16} />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="scanner" className="space-y-8">
            <div className="grid xl:grid-cols-2 gap-12">
              {/* Enhanced Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="h-full shadow-xl border-0 bg-gradient-glass backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Camera className="text-primary" size={28} />
                      </motion.div>
                      AI Food Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <AnimatePresence mode="wait">
                      {!showCamera ? (
                        <motion.div
                          key="upload"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 cursor-pointer group
                            ${isAnalyzing 
                              ? 'border-primary bg-gradient-glow animate-pulse-glow' 
                              : 'border-border hover:border-primary hover:bg-gradient-glow hover:shadow-floating'
                            }`}
                          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {imagePreview ? (
                            <div className="space-y-6">
                              <motion.img
                                src={imagePreview}
                                alt="Food preview"
                                className="max-w-full h-64 object-cover rounded-xl mx-auto shadow-card"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                              />
                              {!isAnalyzing && (
                                <motion.p 
                                  className="text-sm text-muted-foreground"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  Click to analyze different food
                                </motion.p>
                              )}
                            </div>
                          ) : (
                            <motion.div 
                              className="space-y-6"
                              whileHover={{ y: -5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Upload className="mx-auto text-muted-foreground group-hover:text-primary transition-colors duration-300" size={64} />
                              <div className="space-y-3">
                                <p className="font-semibold text-lg text-foreground">Upload food image</p>
                                <p className="text-muted-foreground">
                                  PNG, JPG up to 10MB • AI analysis in seconds
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="camera"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative rounded-2xl overflow-hidden"
                        >
                          <video
                            ref={cameraRef}
                            autoPlay
                            playsInline
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                            <Button onClick={capturePhoto} className="bg-white text-black hover:bg-gray-100">
                              <Camera size={20} />
                              Capture
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowCamera(false)}
                              className="bg-white/90 border-white text-black hover:bg-white"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                      disabled={isAnalyzing}
                    />

                    <AnimatePresence>
                      {isAnalyzing && (
                        <motion.div
                          className="text-center space-y-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <motion.div 
                            className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="space-y-2">
                            <p className="font-semibold text-primary">
                              Advanced AI Analysis in Progress...
                            </p>
                            <div className="bg-gradient-shimmer h-1 w-48 mx-auto rounded-full animate-shimmer" />
                            <p className="text-sm text-muted-foreground">
                              Analyzing nutritional content, freshness, and donation suitability
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        variant="hero" 
                        className="w-full group"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                      >
                        <Upload size={20} className="group-hover:rotate-12 transition-transform" />
                        {isAnalyzing ? "Analyzing..." : "Upload Image"}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={startCamera}
                        disabled={isAnalyzing}
                      >
                        <Camera size={20} />
                        Use Camera
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Results Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card className="h-full shadow-xl border-0 bg-gradient-glass backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Zap className="text-primary" size={28} />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {analysis ? (
                        <motion.div
                          key="results"
                          className="space-y-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <div className="space-y-4">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
                                {analysis.name}
                              </h3>
                              <div className="flex gap-3">
                                <Badge variant="secondary" className="text-lg px-4 py-1">
                                  {analysis.category}
                                </Badge>
                                <Badge className={`text-lg px-4 py-1 border ${getFreshnessColor(analysis.freshness)}`}>
                                  {analysis.freshness}
                                </Badge>
                              </div>
                            </motion.div>

                            <div className="grid gap-4">
                              {[
                                { label: "Estimated Expiry", value: analysis.estimatedExpiry, icon: <Clock size={18} /> },
                                { label: "Carbon Footprint", value: analysis.carbonFootprint, icon: <Leaf size={18} className="text-success" /> },
                                { label: "Confidence Level", value: `${analysis.confidence}%`, icon: <Brain size={18} className="text-primary" /> }
                              ].map((item, index) => (
                                <motion.div
                                  key={index}
                                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + index * 0.1 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <span className="font-medium flex items-center gap-2">
                                    {item.icon}
                                    {item.label}
                                  </span>
                                  <span className="text-muted-foreground font-mono">{item.value}</span>
                                </motion.div>
                              ))}
                            </div>

                            <motion.div
                              className="p-4 rounded-xl bg-muted/30"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                            >
                              <span className="font-medium block mb-3 flex items-center gap-2">
                                <BarChart3 size={18} className="text-accent" />
                                Nutritional Analysis
                              </span>
                              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.nutritionalValue}</p>
                            </motion.div>

                            <motion.div
                              className="flex items-center justify-between p-4 rounded-xl bg-success/10 border border-success/20"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 }}
                            >
                              <span className="font-medium">Donation Suitability</span>
                              <div className="flex items-center gap-3">
                                {getSuitabilityIcon(analysis.donationSuitability)}
                                <span className="capitalize font-semibold text-success">{analysis.donationSuitability}</span>
                              </div>
                            </motion.div>

                            <motion.div
                              className="space-y-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1 }}
                            >
                              <h4 className="font-semibold flex items-center gap-2">
                                <Sparkles size={18} className="text-warning" />
                                AI Insights
                              </h4>
                              <ul className="space-y-2">
                                {analysis.aiInsights.map((insight, index) => (
                                  <motion.li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.1 + index * 0.1 }}
                                  >
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    {insight}
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>

                            {analysis.donationSuitability !== "not_recommended" && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4 }}
                              >
                                <Button variant="success" className="w-full group" size="lg">
                                  <CheckCircle size={20} className="group-hover:rotate-12 transition-transform" />
                                  List for Donation
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          className="flex items-center justify-center h-96 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="space-y-6">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Brain className="mx-auto text-muted-foreground" size={64} />
                            </motion.div>
                            <div className="space-y-2">
                              <p className="text-lg font-semibold text-foreground">Ready for AI Analysis</p>
                              <p className="text-muted-foreground max-w-sm mx-auto">
                                Upload a food image to see detailed nutritional analysis, freshness assessment, and donation recommendations
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search analysis history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-muted/50">
                  <Filter size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fruit">Fruit</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6">
              <AnimatePresence>
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="shadow-card hover:shadow-floating transition-all duration-300 border-0 bg-gradient-glass">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={item.image}
                            alt={item.analysis.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-soft flex-shrink-0"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-semibold text-foreground">{item.analysis.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                              <Badge className={getFreshnessColor(item.analysis.freshness)}>
                                {item.analysis.freshness}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className="text-muted-foreground">Category: <span className="text-foreground">{item.analysis.category}</span></span>
                              <span className="text-muted-foreground">Confidence: <span className="text-foreground">{item.analysis.confidence}%</span></span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredHistory.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <BarChart3 className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">No analysis history found</p>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {[
                { title: "Total Scans", value: "1,247", change: "+23%", icon: <Zap className="text-primary" /> },
                { title: "Donation Ready", value: "892", change: "+31%", icon: <CheckCircle className="text-success" /> },
                { title: "CO2 Saved", value: "2.4 tons", change: "+18%", icon: <Leaf className="text-accent" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-card hover:shadow-floating transition-all duration-300 border-0 bg-gradient-glass">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="flex justify-center">{stat.icon}</div>
                      <div>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success">{stat.change}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};