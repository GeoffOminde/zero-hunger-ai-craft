import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { AIFoodScanner } from "@/components/AIFoodScanner";
import { FoodDonation } from "@/components/FoodDonation";
import { ImpactDashboard } from "@/components/ImpactDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FoodDonation />
      <AIFoodScanner />
      <ImpactDashboard />
    </div>
  );
};

export default Index;
