import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Users, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-earth">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 text-primary/20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf size={60} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 right-16 text-accent/20"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Heart size={40} />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-20 max-w-4xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users size={16} />
            Fighting Hunger with AI
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight mb-6"
        >
          Zero<span className="text-primary">Waste</span> AI
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
        >
          Connect food donors with recipients through intelligent AI matching.
          <br />
          <span className="text-primary font-semibold">Reduce waste. Feed communities. Save the planet.</span>
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button variant="hero" size="lg" className="group">
            Start Donating Food
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
          
          <Button variant="outline" size="lg">
            Find Food Near Me
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { icon: <Leaf size={24} />, title: "AI-Powered", desc: "Smart food recognition & matching" },
            { icon: <Heart size={24} />, title: "Zero Hunger", desc: "Supporting SDG 2 goals" },
            { icon: <Users size={24} />, title: "Community", desc: "Connecting donors & recipients" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-card transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-primary mb-3 flex justify-center">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};