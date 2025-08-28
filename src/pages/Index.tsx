import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { EnhancedAIScanner } from "@/components/EnhancedAIScanner";
import { EnhancedFoodDonation } from "@/components/EnhancedFoodDonation";
import { EnhancedImpactDashboard } from "@/components/EnhancedImpactDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <EnhancedFoodDonation />
      <EnhancedAIScanner />
      <EnhancedImpactDashboard />
    </div>
  );
};

export default Index;
