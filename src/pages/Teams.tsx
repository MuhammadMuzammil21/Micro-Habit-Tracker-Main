import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Crown, TrendingUp, Target } from "lucide-react";

export default function Teams() {
  const [open, setOpen] = useState(false);

  const mockTeams = [
    {
      id: "1",
      name: "Engineering Team",
      description: "Building better habits together",
      memberCount: 8,
      activeHabits: 12,
      isAdmin: true,
      members: ["JD", "AM", "SK", "RP", "LM", "TW", "NK", "BH"]
    },
    {
      id: "2",
      name: "Design Squad",
      description: "Creative minds, healthy habits",
      memberCount: 5,
      activeHabits: 8,
      isAdmin: false,
      members: ["JD", "CF", "MM", "TR", "VN"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Teams</h1>
            <p className="text-muted-foreground">Collaborate and build habits together</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary shadow-soft gap-2 hover:opacity-90">
                <Plus className="h-4 w-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50">
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input id="team-name" placeholder="e.g., Engineering Team" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Textarea id="team-description" placeholder="What's your team about?" rows={3} />
                </div>
                <Button className="w-full gradient-primary">Create Team</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTeams.map((team) => (
            <Card key={team.id} className="p-6 glass-card hover:shadow-medium transition-smooth group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{team.name}</h3>
                      {team.isAdmin && (
                        <Badge variant="outline" className="border-accent text-accent">
                          <Crown className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Members</span>
                  </div>
                  <p className="text-2xl font-bold">{team.memberCount}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Habits</span>
                  </div>
                  <p className="text-2xl font-bold">{team.activeHabits}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Team Members</p>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 6).map((member, idx) => (
                    <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {member}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.memberCount > 6 && (
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center">
                      <span className="text-xs font-medium">+{team.memberCount - 6}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View Team
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
