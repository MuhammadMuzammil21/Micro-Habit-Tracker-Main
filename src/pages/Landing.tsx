import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2, Users, TrendingUp, Target, Zap, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background dark:from-background dark:via-secondary/10 dark:to-background">
      {/* Header */}
      <header className="glass-navbar sticky top-0 z-50">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">HabitLink</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
            🎉 Build Better Habits Together
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Transform Your Life,{" "}
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              One Habit at a Time
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Track micro-habits, stay accountable with your team, and celebrate every win together. 
            HabitLink makes habit building social, fun, and effective.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-lg px-8 py-6 h-auto">
                Start Free Today
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Free forever • No credit card required • 2 minute setup
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Why HabitLink?</h3>
            <p className="text-xl text-muted-foreground">Everything you need to build lasting habits</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="h-6 w-6" />,
                title: "Team Accountability",
                description: "Share habits with your team and stay motivated together. See real-time updates when teammates complete habits."
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Track Your Progress",
                description: "Visualize your streaks, completion rates, and growth over time with beautiful analytics and insights."
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "Micro-Habits",
                description: "Focus on small, achievable daily habits that compound into massive results over time."
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Real-Time Feed",
                description: "Get instant updates when your team members complete habits and hit milestones. Celebrate together!"
              },
              {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "Simple & Intuitive",
                description: "Clean, beautiful interface that makes habit tracking effortless. No clutter, just results."
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Privacy First",
                description: "Your data is secure and private. Choose what to share with your team and what to keep personal."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 glass-card hover:shadow-medium transition-smooth group">
                <div className="p-3 rounded-xl bg-primary/10 text-primary inline-block mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 glass-card text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">10K+</p>
                <p className="text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">50K+</p>
                <p className="text-muted-foreground">Habits Tracked</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">87%</p>
                <p className="text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 glass-card text-center bg-gradient-to-br from-primary/10 to-success/10 border-primary/20">
            <h3 className="text-4xl font-bold mb-4">Ready to Build Better Habits?</h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of people transforming their lives, one habit at a time.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-lg px-8 py-6 h-auto">
                Get Started for Free
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-lg">HabitLink</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Building better habits together, one day at a time.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 HabitLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;