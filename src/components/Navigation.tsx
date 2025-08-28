import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, Heart, Users, Camera } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Donate Food", href: "#donate", icon: <Heart size={16} /> },
    { label: "Find Food", href: "#find", icon: <Users size={16} /> },
    { label: "AI Scanner", href: "#scanner", icon: <Camera size={16} /> },
    { label: "Impact", href: "#impact", icon: <Leaf size={16} /> },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Leaf className="text-primary-foreground" size={24} />
            </div>
            <span className="text-xl font-bold text-foreground">
              Zero<span className="text-primary">Waste</span> AI
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </motion.a>
            ))}
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden"
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="px-4 pt-2 pb-6 space-y-3 bg-background/95 backdrop-blur-md border-t border-border/50">
          {navItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
              whileTap={{ scale: 0.98 }}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </motion.a>
          ))}
          <div className="pt-3">
            <Button variant="hero" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};