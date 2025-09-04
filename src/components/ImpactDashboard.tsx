import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Leaf, Heart, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ImpactDashboard = () => {
  const [impactStats, setImpactStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImpactData();
  }, []);

  const loadImpactData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('impact-metrics');
      
      if (error) throw error;

      // Transform metrics data
      const metricsMap = new Map();
      data.metrics?.forEach((metric: any) => {
        metricsMap.set(metric.metric_type, metric);
      });

      const transformedStats = [
        {
          id: "meals",
          title: "Meals Saved",
          value: metricsMap.get('meals_saved')?.value?.toLocaleString() || "0",
          change: "+23%",
          trend: "up",
          icon: <Heart className="text-success" size={24} />,
          description: "Meals rescued from waste this month"
        },
        {
          id: "donors",
          title: "Donations Completed",
          value: metricsMap.get('donations_completed')?.value?.toLocaleString() || "0",
          change: "+15%", 
          trend: "up",
          icon: <Users className="text-primary" size={24} />,
          description: "Successful food donations"
        },
        {
          id: "waste",
          title: "Waste Reduced",
          value: `${(metricsMap.get('waste_reduced')?.value || 0)} lbs`,
          change: "+31%",
          trend: "up", 
          icon: <Leaf className="text-accent" size={24} />,
          description: "Food waste prevented from landfills"
        },
        {
          id: "communities",
          title: "People Helped",
          value: metricsMap.get('users_helped')?.value?.toLocaleString() || "0",
          change: "+8%",
          trend: "up",
          icon: <MapPin className="text-warning" size={24} />,
          description: "People receiving food donations"
        }
      ];

      setImpactStats(transformedStats);

      // Transform recent activities
      const transformedActivities = data.recent_activities?.slice(0, 3).map((activity: any, index: number) => ({
        id: activity.id,
        type: activity.activity_type,
        title: activity.description,
        time: formatTimeAgo(activity.created_at),
        location: activity.location || "Unknown location"
      })) || [];

      setRecentActivity(transformedActivities);
      
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };
  return (
    <section id="impact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp size={16} />
            Real-Time Impact
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Measuring Our Progress Against Zero Hunger
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track the collective impact of our community's efforts to reduce food waste 
            and feed those in need across the city.
          </p>
        </motion.div>

        {/* Impact Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 bg-muted rounded"></div>
                      <div className="w-12 h-6 bg-muted rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-20 h-4 bg-muted rounded"></div>
                      <div className="w-16 h-8 bg-muted rounded"></div>
                      <div className="w-full h-3 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            impactStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {stat.icon}
                    <Badge 
                      variant="outline" 
                      className="bg-success/10 text-success border-success/20"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SDG Progress */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-primary" size={24} />
                  SDG 2: Zero Hunger Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Food Access Improvement</span>
                    <span className="text-sm text-muted-foreground">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Waste Reduction Target</span>
                    <span className="text-sm text-muted-foreground">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Community Engagement</span>
                    <span className="text-sm text-muted-foreground">81%</span>
                  </div>
                  <Progress value={81} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Our AI-powered platform is making measurable progress toward UN Sustainable 
                    Development Goal 2, helping to end hunger and achieve food security.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-primary" size={24} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  // Loading skeleton for activities
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="flex-shrink-0 w-2 h-2 bg-muted rounded-full mt-2" />
                      <div className="flex-1 animate-pulse">
                        <div className="w-3/4 h-4 bg-muted rounded mb-2"></div>
                        <div className="flex gap-4">
                          <div className="w-16 h-3 bg-muted rounded"></div>
                          <div className="w-24 h-3 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto text-muted-foreground mb-4" size={48} />
                    <p className="text-muted-foreground">No recent activities yet.</p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin size={10} />
                          {activity.location}
                        </span>
                      </div>
                      </div>
                    </motion.div>
                  ))
                )}

                <div className="pt-4 border-t">
                  <p className="text-center text-sm text-muted-foreground">
                    {loading ? 'Loading activities...' : 'Showing latest activities from the database'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};