import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, User, Calendar, Trophy, Target, TrendingUp, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data.data;
    },
    onSuccess: (data) => {
      setName(data.name || "");
      setEmail(data.email || "");
    },
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/stats');
      return response.data.data;
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string; avatarUrl?: string }) => api.put('/auth/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name });
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };
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
              {userLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                        {getInitials(userData?.name, userData?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="gap-2" disabled>
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <form onSubmit={handleSave} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={updateProfileMutation.isPending}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={email}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {stats?.completionRate && stats.completionRate >= 80 && (
                          <Badge variant="outline" className="border-primary text-primary">
                            <Trophy className="h-3 w-3 mr-1" />
                            Top Performer
                          </Badge>
                        )}
                        {stats?.totalCompletions && stats.totalCompletions >= 100 && (
                          <Badge variant="outline" className="border-accent text-accent">
                            <Target className="h-3 w-3 mr-1" />
                            100+ Habits Completed
                          </Badge>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="gradient-primary"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </Card>

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 glass-card">
                  <div className="flex items-center justify-center h-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 glass-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">Total Completions</h3>
                </div>
                <p className="text-3xl font-bold">{stats?.totalCompletions || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">Across all habits</p>
              </Card>

              <Card className="p-6 glass-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">Completion Rate</h3>
                </div>
                <p className="text-3xl font-bold">{Math.round(stats?.completionRate || 0)}%</p>
                <p className="text-sm text-muted-foreground mt-1">Overall</p>
              </Card>

              <Card className="p-6 glass-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">Longest Streak</h3>
                </div>
                <p className="text-3xl font-bold">{stats?.longestStreak || 0} days</p>
                <p className="text-sm text-muted-foreground mt-1">Personal best</p>
              </Card>
            </div>
          )}

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {stats?.longestStreak && stats.longestStreak >= 30 && (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="text-3xl">🔥</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">30+ Day Streak</h4>
                    <p className="text-sm text-muted-foreground">Maintained a {stats.longestStreak} day streak</p>
                  </div>
                </div>
              )}
              {stats?.totalCompletions && stats.totalCompletions >= 100 && (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="text-3xl">🎯</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">100+ Completions</h4>
                    <p className="text-sm text-muted-foreground">Completed {stats.totalCompletions} habits total</p>
                  </div>
                </div>
              )}
              {stats?.completionRate && stats.completionRate >= 80 && (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="text-3xl">⭐</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">High Performer</h4>
                    <p className="text-sm text-muted-foreground">Maintaining {Math.round(stats.completionRate)}% completion rate</p>
                  </div>
                </div>
              )}
              {(!stats || (stats.longestStreak < 30 && stats.totalCompletions < 100 && stats.completionRate < 80)) && (
                <p className="text-center text-muted-foreground py-4">
                  Keep building habits to unlock achievements!
                </p>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
