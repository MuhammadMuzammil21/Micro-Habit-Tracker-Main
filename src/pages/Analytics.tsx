import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Target, Award, Calendar, Loader2, Users } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TeamLeaderboard } from "@/components/TeamLeaderboard";
import api from "@/lib/api";

export default function Analytics() {
  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/stats');
      return response.data.data;
    },
  });

  // Fetch weekly progress
  const { data: weeklyData = [], isLoading: weeklyLoading } = useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: async () => {
      const response = await api.get('/analytics/weekly');
      return response.data.data;
    },
  });

  // Fetch habit breakdown
  const { data: habitBreakdown = [], isLoading: breakdownLoading } = useQuery({
    queryKey: ['analytics', 'breakdown'],
    queryFn: async () => {
      const response = await api.get('/analytics/breakdown');
      return response.data.data;
    },
  });

  // Fetch monthly trend
  const { data: monthlyTrend = [], isLoading: trendLoading } = useQuery({
    queryKey: ['analytics', 'trend'],
    queryFn: async () => {
      const response = await api.get('/analytics/trend');
      return response.data.data;
    },
  });

  // Fetch teams for leaderboard
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data.data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your progress and insights</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="glass-card border border-border/50">
            <TabsTrigger value="personal">Personal Stats</TabsTrigger>
            <TabsTrigger value="team">Team Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {statsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 glass-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Target className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1 tracking-tight">{Math.round(stats?.completionRate || 0)}%</p>
                  <p className="text-sm text-muted-foreground font-medium">Completion Rate</p>
                </Card>

                <Card className="p-6 glass-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1 tracking-tight">{stats?.currentStreak || 0}</p>
                  <p className="text-sm text-muted-foreground font-medium">Current Streak</p>
                </Card>

                <Card className="p-6 glass-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1 tracking-tight">{stats?.totalCompletions || 0}</p>
                  <p className="text-sm text-muted-foreground font-medium">Total Completions</p>
                </Card>

                <Card className="p-6 glass-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1 tracking-tight">{stats?.activeHabits || 0}</p>
                  <p className="text-sm text-muted-foreground font-medium">Active Habits</p>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 glass-card">
                <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
                {weeklyLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                      <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="total" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card className="p-6 glass-card">
                <h3 className="text-lg font-semibold mb-4">Habit Breakdown</h3>
                {breakdownLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : habitBreakdown.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={habitBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                      >
                        {habitBreakdown.map((entry: any, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || `hsl(var(--chart-${index + 1}))`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>

            <Card className="p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">6-Month Trend</h3>
              {trendLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {teams.length === 0 ? (
              <Card className="p-6 glass-card">
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You're not part of any teams yet.</p>
                  <p className="text-sm mt-2">Join a team to see leaderboards!</p>
                </div>
              </Card>
            ) : (
              teams.map((team: any) => (
                <TeamLeaderboard 
                  key={team.id || team._id} 
                  teamId={team.id || team._id} 
                  teamName={team.name} 
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
