import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, User, Calendar, Trophy, Target, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your profile and view your achievements</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 glass-card">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Change Photo
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member since January 2024
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="border-primary text-primary">
                    <Trophy className="h-3 w-3 mr-1" />
                    Top Performer
                  </Badge>
                  <Badge variant="outline" className="border-accent text-accent">
                    <Target className="h-3 w-3 mr-1" />
                    100+ Habits Completed
                  </Badge>
                </div>

                <Button className="gradient-primary">Save Changes</Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 glass-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Trophy className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Total Streaks</h3>
              </div>
              <p className="text-3xl font-bold">142</p>
              <p className="text-sm text-muted-foreground mt-1">Across all habits</p>
            </Card>

            <Card className="p-6 glass-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Completion Rate</h3>
              </div>
              <p className="text-3xl font-bold">87%</p>
              <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
            </Card>

            <Card className="p-6 glass-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Longest Streak</h3>
              </div>
              <p className="text-3xl font-bold">45 days</p>
              <p className="text-sm text-muted-foreground mt-1">Personal best</p>
            </Card>
          </div>

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {[
                { title: "30-Day Streak", description: "Completed meditation for 30 consecutive days", date: "2 days ago", icon: "🔥" },
                { title: "Team Player", description: "Joined 3 team habits", date: "1 week ago", icon: "🤝" },
                { title: "Early Bird", description: "Completed morning exercise 20 times", date: "2 weeks ago", icon: "🌅" },
              ].map((achievement, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
