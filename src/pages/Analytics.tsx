import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Target, Award, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const weeklyData = [
    { day: "Mon", completed: 6, total: 8 },
    { day: "Tue", completed: 7, total: 8 },
    { day: "Wed", completed: 5, total: 8 },
    { day: "Thu", completed: 8, total: 8 },
    { day: "Fri", completed: 6, total: 8 },
    { day: "Sat", completed: 7, total: 8 },
    { day: "Sun", completed: 6, total: 8 },
  ];

  const habitBreakdown = [
    { name: "Morning Exercise", value: 85, color: "hsl(var(--primary))" },
    { name: "Reading", value: 75, color: "hsl(var(--chart-2))" },
    { name: "Meditation", value: 92, color: "hsl(var(--chart-3))" },
    { name: "Journaling", value: 68, color: "hsl(var(--chart-4))" },
  ];

  const monthlyTrend = [
    { month: "Jan", rate: 65 },
    { month: "Feb", rate: 72 },
    { month: "Mar", rate: 78 },
    { month: "Apr", rate: 85 },
    { month: "May", rate: 87 },
    { month: "Jun", rate: 89 },
  ];

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    +5%
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1 tracking-tight">87%</p>
                <p className="text-sm text-muted-foreground font-medium">Completion Rate</p>
              </Card>

              <Card className="p-6 glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1 tracking-tight">23</p>
                <p className="text-sm text-muted-foreground font-medium">Current Streak</p>
              </Card>

              <Card className="p-6 glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1 tracking-tight">156</p>
                <p className="text-sm text-muted-foreground font-medium">Total Completions</p>
              </Card>

              <Card className="p-6 glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1 tracking-tight">8</p>
                <p className="text-sm text-muted-foreground font-medium">Active Habits</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 glass-card">
                <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
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
              </Card>

              <Card className="p-6 glass-card">
                <h3 className="text-lg font-semibold mb-4">Habit Breakdown</h3>
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
                      {habitBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
              </Card>
            </div>

            <Card className="p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">6-Month Trend</h3>
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
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="p-6 glass-card">
              <h3 className="text-lg font-semibold mb-4">Team Leaderboard</h3>
              <div className="space-y-3">
                {[
                  { name: "John Doe", streak: 28, completionRate: 92 },
                  { name: "Alice Miller", streak: 25, completionRate: 89 },
                  { name: "Sarah Kim", streak: 23, completionRate: 87 },
                  { name: "Robert Park", streak: 20, completionRate: 85 },
                  { name: "Lisa Martinez", streak: 18, completionRate: 82 },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth">
                    <span className="text-2xl font-bold text-muted-foreground w-8">#{idx + 1}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.streak} day streak • {member.completionRate}% completion</p>
                    </div>
                    {idx === 0 && <Award className="h-6 w-6 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
