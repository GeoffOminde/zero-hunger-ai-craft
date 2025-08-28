import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Zap, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface FoodAnalysis {
  name: string;
  category: string;
  freshness: "excellent" | "good" | "fair" | "poor";
  estimatedExpiry: string;
  nutritionalValue: string;
  donationSuitability: "excellent" | "good" | "not_recommended";
  confidence: number;
}

export const AIFoodScanner = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock AI analysis - In real app, this would use Hugging Face transformers
  const analyzeFood = async (imageFile: File) => {
    setIsAnalyzing(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(imageFile);

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis result
      const mockResults: FoodAnalysis[] = [
        {
          name: "Fresh Apples",
          category: "Fruit",
          freshness: "excellent",
          estimatedExpiry: "5-7 days",
          nutritionalValue: "High vitamin C, fiber",
          donationSuitability: "excellent",
          confidence: 95
        },
        {
          name: "Mixed Vegetables",
          category: "Vegetables",
          freshness: "good",
          estimatedExpiry: "3-4 days",
          nutritionalValue: "Rich in vitamins A, K",
          donationSuitability: "good",
          confidence: 87
        },
        {
          name: "Bread Loaf",
          category: "Bakery",
          freshness: "fair",
          estimatedExpiry: "1-2 days",
          nutritionalValue: "Carbohydrates, protein",
          donationSuitability: "good",
          confidence: 92
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysis(randomResult);
      
      toast.success("Food analysis completed!");
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

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case "excellent": return "text-success bg-success/10";
      case "good": return "text-primary bg-primary/10";
      case "fair": return "text-warning bg-warning/10";
      case "poor": return "text-destructive bg-destructive/10";
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

  return (
    <section id="scanner" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap size={16} />
            AI-Powered Food Analysis
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Smart Food Scanner
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your food and get instant AI analysis of freshness, 
            nutritional value, and donation suitability.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="text-primary" size={24} />
                  Food Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
                    ${isAnalyzing 
                      ? 'border-primary bg-primary/5 animate-pulse' 
                      : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Food preview"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      {!isAnalyzing && (
                        <p className="text-sm text-muted-foreground">
                          Click to analyze different food
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto text-muted-foreground" size={48} />
                      <div>
                        <p className="font-medium text-foreground">Upload food image</p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isAnalyzing}
                />

                {isAnalyzing && (
                  <motion.div
                    className="text-center space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="animate-spin mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                    <p className="text-sm text-primary font-medium">
                      AI is analyzing your food...
                    </p>
                  </motion.div>
                )}

                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                >
                  <Camera size={20} />
                  {isAnalyzing ? "Analyzing..." : "Scan Food"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-primary" size={24} />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {analysis.name}
                      </h3>
                      <Badge variant="secondary">{analysis.category}</Badge>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="font-medium">Freshness</span>
                        <Badge className={getFreshnessColor(analysis.freshness)}>
                          {analysis.freshness}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="font-medium">Estimated Expiry</span>
                        <span className="text-muted-foreground">{analysis.estimatedExpiry}</span>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/30">
                        <span className="font-medium block mb-2">Nutritional Value</span>
                        <p className="text-sm text-muted-foreground">{analysis.nutritionalValue}</p>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                        <span className="font-medium">Donation Suitability</span>
                        <div className="flex items-center gap-2">
                          {getSuitabilityIcon(analysis.donationSuitability)}
                          <span className="capitalize text-sm">{analysis.donationSuitability}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="font-medium">Confidence</span>
                        <Badge variant="outline">{analysis.confidence}%</Badge>
                      </div>
                    </div>

                    {analysis.donationSuitability !== "not_recommended" && (
                      <Button variant="success" className="w-full">
                        <CheckCircle size={20} />
                        List for Donation
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-center">
                    <div>
                      <Camera className="mx-auto text-muted-foreground mb-4" size={48} />
                      <p className="text-muted-foreground">
                        Upload a food image to see AI analysis results
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};