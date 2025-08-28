import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, Leaf, Heart, MapPin, Calendar, Globe, Award, Target, Activity, BarChart3, PieChart, LineChart, Clock } from "lucide-react";

const impactStats = [
  {
    id: "meals",
    title: "Meals Saved",
    value: "18,394",
    change: "+23%",
    trend: "up",
    icon: <Heart className="text-success" size={28} />,
    description: "Meals rescued from waste this month",
    details: "Daily average: 612 meals",
    color: "bg-success/10 border-success/20"
  },
  {
    id: "donors",
    title: "Active Donors",
    value: "847",
    change: "+15%", 
    trend: "up",
    icon: <Users className="text-primary" size={28} />,
    description: "Businesses and individuals donating food",
    details: "New donors this week: 23",
    color: "bg-primary/10 border-primary/20"
  },
  {
    id: "waste",
    title: "Waste Reduced",
    value: "12.7 tons",
    change: "+31%",
    trend: "up", 
    icon: <Leaf className="text-accent" size={28} />,
    description: "Food waste prevented from landfills",
    details: "CO2 equivalent: 38.1 tons saved",
    color: "bg-accent/10 border-accent/20"
  },
  {
    id: "communities",
    title: "Communities Served",
    value: "94",
    change: "+8%",
    trend: "up",
    icon: <MapPin className="text-warning" size={28} />,
    description: "Neighborhoods receiving food donations",
    details: "Coverage: 73% of city districts",
    color: "bg-warning/10 border-warning/20"
  },
  {
    id: "efficiency",
    title: "AI Efficiency",
    value: "97.3%",
    change: "+2.1%",
    trend: "up",
    icon: <Target className="text-purple-500" size={28} />,
    description: "Successful food matches by AI",
    details: "Response time: <2 minutes",
    color: "bg-purple-100 border-purple-200"
  },
  {
    id: "impact_score",
    title: "SDG Impact Score",
    value: "8.7/10",
    change: "+0.4",
    trend: "up",
    icon: <Award className="text-orange-500" size={28} />,
    description: "UN SDG 2 progress rating",
    details: "Target: 9.0 by year-end",
    color: "bg-orange-100 border-orange-200"
  }
];

const recentActivity = [
  {
    id: 1,
    type: "donation",
    title: "Metro Grocery donated 85 lbs of organic produce",
    time: "1 hour ago",
    location: "Downtown District",
    impact: "~140 meals",
    category: "high-impact"
  },
  {
    id: 2, 
    type: "rescue",
    title: "Community Center received bakery items for 60 people",
    time: "3 hours ago",
    location: "East Side",
    impact: "60 meals",
    category: "medium-impact"
  },
  {
    id: 3,
    type: "match",
    title: "AI matched 5 new donor-recipient pairs with 98% compatibility",
    time: "4 hours ago",
    location: "Citywide",
    impact: "Efficiency boost",
    category: "ai-success"
  },
  {
    id: 4,
    type: "milestone",
    title: "Reached 1000th successful food rescue this month",
    time: "6 hours ago", 
    location: "Platform-wide",
    impact: "Major milestone",
    category: "celebration"
  },
  {
    id: 5,
    type: "partnership",
    title: "New restaurant chain partnership signed",
    time: "1 day ago",
    location: "Regional",
    impact: "15 new locations",
    category: "growth"
  }
];

const sdgProgress = [
  {
    name: "Food Access Improvement",
    value: 78,
    target: 85,
    description: "Increasing access to nutritious food in underserved areas"
  },
  {
    name: "Waste Reduction Target",
    value: 71,
    target: 80,
    description: "Reducing food waste by connecting surplus with need"
  },
  {
    name: "Community Engagement",
    value: 84,
    target: 90,
    description: "Active participation in sustainable food systems"
  },
  {
    name: "Nutrition Quality",
    value: 82,
    target: 85,
    description: "Ensuring donated food meets nutritional standards"
  },
  {
    name: "Environmental Impact",
    value: 76,
    target: 85,
    description: "Reducing carbon footprint through waste prevention"
  }
];

export const EnhancedImpactDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [activeMetric, setActiveMetric] = useState("overview");

  return (
    <section id="impact" className="py-24 px-4">
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
            <TrendingUp size={18} />
            Real-Time Impact Analytics
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Measuring Our <span className="bg-gradient-to-r from-primary via-success to-accent bg-clip-text text-transparent">Zero Hunger</span> Progress
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Advanced analytics tracking our collective impact on food waste reduction and community nutrition.
            Every metric brings us closer to UN Sustainable Development Goal 2.
          </p>
        </motion.div>

        {/* Time Frame Selector */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-48 bg-muted/50 backdrop-blur-sm">
              <Calendar size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <Tabs value={activeMetric} onValueChange={setActiveMetric} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="sdg" className="flex items-center gap-2">
                <Target size={16} />
                <span className="hidden sm:inline">SDG Goals</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity size={16} />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <PieChart size={16} />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="overview" className="space-y-12">
            {/* Enhanced Impact Stats Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100 
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8, 
                    transition: { type: "spring", stiffness: 300 } 
                  }}
                >
                  <Card className={`h-full shadow-xl hover:shadow-floating transition-all duration-500 border-2 ${stat.color} backdrop-blur-sm bg-gradient-glass`}>
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          whileHover={{ rotate: 12, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {stat.icon}
                        </motion.div>
                        <Badge 
                          variant="outline" 
                          className="bg-success/10 text-success border-success/30 font-mono"
                        >
                          {stat.change}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {stat.title}
                          </p>
                          <motion.p 
                            className="text-4xl font-heading font-bold text-foreground"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.3 }}
                            viewport={{ once: true }}
                          >
                            {stat.value}
                          </motion.p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {stat.description}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {stat.details}
                          </p>
                        </div>
                        
                        <div className="pt-4 border-t border-border/30">
                          <div className="w-full bg-muted/30 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-primary h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: "75%" }}
                              transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                              viewport={{ once: true }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Monthly target: 75% achieved</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="sdg" className="space-y-8">
            <motion.div
              className="grid lg:grid-cols-2 gap-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* SDG Progress */}
              <Card className="shadow-xl border-0 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Target className="text-primary" size={28} />
                    SDG 2: Zero Hunger Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {sdgProgress.map((goal, index) => (
                    <motion.div
                      key={goal.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-sm font-semibold">{goal.name}</span>
                          <p className="text-xs text-muted-foreground">{goal.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">{goal.value}%</span>
                          <p className="text-xs text-muted-foreground">Target: {goal.target}%</p>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={goal.value} className="h-3" />
                        <motion.div
                          className="absolute top-0 right-0 w-1 h-3 bg-border rounded-full"
                          style={{ right: `${100 - goal.target}%` }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  <div className="pt-6 border-t space-y-4">
                    <div className="flex items-center gap-3">
                      <Globe className="text-primary" size={20} />
                      <span className="font-semibold">Global SDG Alignment</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Our AI-powered platform is making measurable progress toward UN Sustainable 
                      Development Goal 2, helping to end hunger, achieve food security, improve 
                      nutrition, and promote sustainable agriculture.
                    </p>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-lg text-success">8.7/10</p>
                        <p className="text-muted-foreground">Overall Score</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg text-primary">94th</p>
                        <p className="text-muted-foreground">Global Percentile</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg text-accent">2025</p>
                        <p className="text-muted-foreground">Target Year</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Visualization */}
              <Card className="shadow-xl border-0 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <LineChart className="text-accent" size={28} />
                    Impact Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="text-center p-6 rounded-xl bg-success/10 border border-success/20">
                      <motion.div
                        className="text-4xl font-heading font-bold text-success mb-2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        viewport={{ once: true }}
                      >
                        73%
                      </motion.div>
                      <p className="text-sm text-muted-foreground">
                        Reduction in local food insecurity
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10">
                        <p className="text-2xl font-bold text-primary">2,847</p>
                        <p className="text-xs text-muted-foreground">Families Fed</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-accent/10">
                        <p className="text-2xl font-bold text-accent">156</p>
                        <p className="text-xs text-muted-foreground">Partner Orgs</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Monthly Trends</h4>
                      <div className="space-y-2">
                        {[
                          { month: "January", value: 65, color: "bg-primary" },
                          { month: "February", value: 72, color: "bg-success" },
                          { month: "March", value: 78, color: "bg-accent" }
                        ].map((month, index) => (
                          <div key={month.month} className="flex items-center gap-3">
                            <span className="text-sm w-20">{month.month}</span>
                            <div className="flex-1 bg-muted/30 rounded-full h-2">
                              <motion.div
                                className={`${month.color} h-2 rounded-full`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${month.value}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                viewport={{ once: true }}
                              />
                            </div>
                            <span className="text-sm font-mono">{month.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-8">
            {/* Recent Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-xl border-0 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Activity className="text-primary" size={28} />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-start gap-6 p-6 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors border border-border/30"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full mt-1 ${
                            activity.category === 'high-impact' ? 'bg-success animate-pulse-glow' :
                            activity.category === 'ai-success' ? 'bg-primary animate-pulse' :
                            activity.category === 'celebration' ? 'bg-warning animate-bounce-gentle' :
                            'bg-accent'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <p className="font-medium text-foreground leading-relaxed">
                            {activity.title}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock size={12} />
                              {activity.time}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <MapPin size={12} />
                              {activity.location}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {activity.impact}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.div
                    className="text-center pt-6 border-t border-border/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <p className="text-sm text-muted-foreground">
                      Showing latest activities • Updates every 30 seconds
                    </p>
                    <div className="flex justify-center mt-4">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics">
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PieChart className="mx-auto text-muted-foreground mb-4" size={64} />
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">Advanced Analytics</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Detailed analytics and reporting coming soon. Connect with Supabase to enable advanced data tracking and insights.
              </p>
              <Button variant="outline" size="lg">
                Enable Advanced Analytics
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};